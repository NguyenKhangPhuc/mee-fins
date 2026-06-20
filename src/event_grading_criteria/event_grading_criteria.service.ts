import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CriteriaUpdationDto } from './dto/criteria-updation.dto';
import {
  INTERNAL_SERVER_ERROR,
  NOT_EXISTED_CRITERIA_ERROR,
} from 'src/constants/error-code';

@Injectable()
export class EventGradingCriteriaService {
  constructor(private prismaService: PrismaService) {}
  async createManyEventCriteria({
    tx,
    criteria,
  }: {
    tx: Prisma.TransactionClient;
    criteria: Prisma.EventGradingCriteriaCreateManyInput[];
  }) {
    const result = await tx.eventGradingCriteria.createMany({ data: criteria });
    return result;
  }

  async updateEventCriteria(criteria: CriteriaUpdationDto) {
    try {
      return await this.prismaService.eventGradingCriteria.update({
        data: criteria,
        where: { id: criteria.id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException({
            message: 'Criteria not found',
            code: NOT_EXISTED_CRITERIA_ERROR,
          });
        }
      }
      throw new InternalServerErrorException({
        message: 'Failed to update criteria',
        code: INTERNAL_SERVER_ERROR,
      });
    }
  }
}
