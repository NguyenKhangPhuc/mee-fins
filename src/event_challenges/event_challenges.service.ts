import { Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

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
}
