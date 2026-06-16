import { Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class GroupChallengesService {
  constructor() {}
  async createManyGroupChallenges({
    tx,
    groupChallenges,
  }: {
    tx: Prisma.TransactionClient;
    groupChallenges: Prisma.GroupChallengeCreateManyInput[];
  }) {
    const result = await tx.groupChallenge.createMany({
      data: groupChallenges,
    });
    return result;
  }
}
