import { Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class FunFactsService {
  constructor() {}
  async createManyFunFacts({
    tx,
    funFacts,
  }: {
    tx: Prisma.TransactionClient;
    funFacts: Prisma.FunFactCreateManyInput[];
  }) {
    const result = await tx.funFact.createMany({ data: funFacts });
    return result;
  }
}
