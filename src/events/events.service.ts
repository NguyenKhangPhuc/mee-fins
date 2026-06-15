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
import { IncludeNode } from 'src/types/include-query';

@Injectable()
export class EventsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllEvent(where: EventQueryDto) {
    try {
      const result = await this.prismaService.event.findMany({
        where: { ...(where.id && { id: where.id }) },
        include: this.buildInclude(where.includes),
      });
      return result;
    } catch {
      throw new InternalServerErrorException({
        message: 'Failed to find all of the events',
        code: INTERNAL_SERVER_ERROR,
      });
    }
  }
  async getSingleEvent(where: EventQueryDto) {
    try {
      const result = await this.prismaService.event.findFirst({
        where: { ...(where.id && { id: where.id }) },
        include: this.buildInclude(where.includes),
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
  buildInclude(include: string | undefined) {
    if (!include) return {};
    const splitted = include.split(',');
    const result: Record<string, IncludeNode> = {};
    for (let i = 0; i < splitted.length; i++) {
      let current = result;
      const nestedJoin = splitted[i].split('.');

      for (let e = 0; e < nestedJoin.length; e++) {
        const part = nestedJoin[e];
        current[part] = current[part] ?? { include: {} };
        current = current[part].include;
      }
    }
  }
}
