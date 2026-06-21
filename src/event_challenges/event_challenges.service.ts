import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  INTERNAL_SERVER_ERROR,
  NOT_EXISTED_CHALLENGE_ERROR,
} from 'src/constants/error-code';

@Injectable()
export class EventChallengesService {
  constructor(private prismaService: PrismaService) {}

  async createManyEventChallenges({
    tx,
    eventChallenges,
  }: {
    tx: Prisma.TransactionClient;
    eventChallenges: Prisma.EventChallengeCreateManyInput[];
  }) {
    const result = await tx.eventChallenge.createMany({
      data: eventChallenges,
    });
    return result;
  }

  async updateEventChallenge(
    eventChallenge: Prisma.EventChallengeUpdateInput,
    eventChallengeId: string,
  ) {
    try {
      const result = await this.prismaService.eventChallenge.update({
        data: eventChallenge,
        where: { id: eventChallengeId },
      });
      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException({
            message: 'Challenge not found',
            code: NOT_EXISTED_CHALLENGE_ERROR,
          });
        }
      }
      throw new InternalServerErrorException({
        message: 'Failed to update event challenge',
        code: INTERNAL_SERVER_ERROR,
      });
    }
  }
}
