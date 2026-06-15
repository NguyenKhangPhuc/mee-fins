import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GroupQueryDto } from './dto/groups-query.dto';
import { QueryService } from 'src/query/query.service';
import { Prisma } from 'src/generated/prisma/client';
import {
  DUPLICATE_GROUP_ERROR,
  INTERNAL_SERVER_ERROR,
  INVALID_INCLUDE_ERROR,
  NOT_EXISTED_GROUP_ERROR,
} from 'src/constants/error-code';

@Injectable()
export class GroupsService {
  constructor(
    private prismaService: PrismaService,
    private queryService: QueryService,
  ) {}

  async getSingleGroup(query: GroupQueryDto) {
    try {
      const result = await this.prismaService.group.findFirst({
        where: {
          ...(query.id && { id: query.id }),
          ...(query.eventId && { eventId: query.eventId }),
        },
        include: this.queryService.buildInclude(query.includes),
      });

      if (!result) {
        throw new NotFoundException({
          message: 'Group not found',
          code: NOT_EXISTED_GROUP_ERROR,
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
        message: 'Failed to get group',
        code: INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getGroups(query: GroupQueryDto) {
    try {
      const result = await this.prismaService.group.findMany({
        where: {
          ...(query.id && { id: query.id }),
          ...(query.eventId && { eventId: query.eventId }),
        },
        include: this.queryService.buildInclude(query.includes),
      });
      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException({
          message: 'Invalid include relation',
          code: INVALID_INCLUDE_ERROR,
        });
      }
      throw new InternalServerErrorException({
        message: 'Fail to get the group',
        code: INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateSingleGroup({
    query,
    body,
  }: {
    query: GroupQueryDto;
    body: Prisma.GroupUpdateInput;
  }) {
    try {
      const result = await this.prismaService.group.update({
        where: {
          id: query.id,
          ...(query.eventId && { eventId: query.eventId }),
        },
        data: body,
        include: this.queryService.buildInclude(query.includes),
      });
      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException({
            message: 'Group not found',
            code: NOT_EXISTED_GROUP_ERROR,
          });
        }
        if (error.code === 'P2002') {
          throw new ConflictException({
            message: 'Group already exists',
            code: DUPLICATE_GROUP_ERROR,
          });
        }
      }
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Invalid include relation');
      }
      throw new InternalServerErrorException('Failed to update group');
    }
  }
}
