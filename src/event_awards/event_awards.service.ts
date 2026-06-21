import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  INTERNAL_SERVER_ERROR,
  NOT_EXISTED_AWARD_ERROR,
} from 'src/constants/error-code';

@Injectable()
export class EventAwardsService {
  constructor(private prismaService: PrismaService) {}
  async createManyEventAwards({
    tx,
    awards,
  }: {
    tx: Prisma.TransactionClient;
    awards: Prisma.EventAwardCreateManyInput[];
  }) {
    const result = await tx.eventAward.createMany({ data: awards });
    return result;
  }

  async updateEventAward(award: Prisma.EventAwardUpdateInput, awardId: string) {
    try {
      const result = await this.prismaService.eventAward.update({
        data: award,
        where: { id: awardId },
      });
      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException({
            message: 'Award not found',
            code: NOT_EXISTED_AWARD_ERROR,
          });
        }
      }
      throw new InternalServerErrorException({
        message: 'Failed to update event award',
        code: INTERNAL_SERVER_ERROR,
      });
    }
  }
}
