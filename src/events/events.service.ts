import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  INTERNAL_SERVER_ERROR,
  INVALID_INCLUDE_ERROR,
  NOT_EXISTED_EVENT_ERROR,
} from 'src/constants/error-code';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventQueryDto } from './dto/events-query.dto';
import { QueryService } from 'src/query/query.service';
import { EventCreationDto } from './dto/event-creation.dto';
import { EventChallengesService } from 'src/event_challenges/event_challenges.service';
import { EventGradingCriteriaService } from 'src/event_grading_criteria/event_grading_criteria.service';
import { FileService } from 'src/file/file.service';
import { EventAwardsService } from 'src/event_awards/event_awards.service';

@Injectable()
export class EventsService {
  constructor(
    private readonly prismaService: PrismaService,
    private queryService: QueryService,
    private eventChallengesService: EventChallengesService,
    private eventCriteriaService: EventGradingCriteriaService,
    private fileService: FileService,
    private awardService: EventAwardsService,
  ) {}

  async getAllEvent(query: EventQueryDto) {
    try {
      const result = await this.prismaService.event.findMany({
        where: { ...(query.id && { id: query.id }) },
        include: this.queryService.buildInclude(query.includes),
      });
      return result;
    } catch {
      throw new InternalServerErrorException({
        message: 'Failed to find all of the events',
        code: INTERNAL_SERVER_ERROR,
      });
    }
  }
  async getSingleEvent(query: EventQueryDto) {
    try {
      const result = await this.prismaService.event.findFirst({
        where: { ...(query.id && { id: query.id }) },
        include: this.queryService.buildInclude(query.includes),
      });
      if (!result) {
        throw new NotFoundException({
          message: 'Not Found Event',
          code: NOT_EXISTED_EVENT_ERROR,
        });
      }
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException({
          message: 'Invalid include relation',
          code: INVALID_INCLUDE_ERROR,
        });
      }
      throw new InternalServerErrorException({
        message: 'Failed to get event',
        code: INTERNAL_SERVER_ERROR,
      });
    }
  }

  async createEvent({
    tx,
    event,
  }: {
    tx: Prisma.TransactionClient;
    event: Prisma.EventUncheckedCreateInput;
  }) {
    const result = await tx.event.create({ data: event });
    return result;
  }

  async createEventWithChallengesAndCriteriaAndAwards(body: EventCreationDto) {
    try {
      await this.prismaService.$transaction(async (tx) => {
        const createdEvent = await this.createEvent({ tx, event: body.event });

        const challenges: Prisma.EventChallengeCreateManyInput[] =
          body.challenges.map((chal) => {
            return { ...chal, eventId: createdEvent.id };
          });
        await this.eventChallengesService.createManyEventChallenges({
          tx,
          eventChallenges: challenges,
        });
        const criteria: Prisma.EventGradingCriteriaCreateManyInput[] =
          body.criteria.map((cri) => {
            return { ...cri, eventId: createdEvent.id };
          });
        await this.eventCriteriaService.createManyEventCriteria({
          tx,
          criteria,
        });
        const awards: Prisma.EventAwardCreateManyInput[] = body.awards.map(
          (award) => {
            return { ...award, eventId: createdEvent.id };
          },
        );
        await this.awardService.createManyEventAwards({ tx, awards });
      });
    } catch {
      throw new InternalServerErrorException({
        message: 'Fail to create the event',
        code: INTERNAL_SERVER_ERROR,
      });
    }
  }
  async updateEventPoster({
    poster,
    eventId,
    oldPosterKey,
  }: {
    poster: Express.Multer.File | undefined;
    oldPosterKey: string;
    eventId: string;
  }) {
    await this.fileService.deleteFile(oldPosterKey);
    if (!poster) {
      try {
        await this.prismaService.event.update({
          data: { posterKey: null, posterPath: null },
          where: { id: eventId },
        });
        return { success: true };
      } catch (error) {
        if (error instanceof InternalServerErrorException) {
          throw error;
        }
        throw new InternalServerErrorException({
          message: 'Fail to update event poster',
          code: INTERNAL_SERVER_ERROR,
        });
      }
    } else {
      const result = await this.fileService.uploadFile(poster, eventId);
      try {
        await this.prismaService.event.update({
          data: { posterKey: result.key, posterPath: result.publicUrl },
          where: { id: eventId },
        });
        return { success: true };
      } catch {
        await this.fileService.deleteFile(result.key);
        throw new InternalServerErrorException({
          message: 'Fail to update event poster',
          code: INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
}
