import { Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { TransactionClient } from 'src/generated/prisma/internal/prismaNamespace';

@Injectable()
export class SubmissionFilesService {
  constructor() {}
  async createManySubmissionFile({
    tx,
    files,
  }: {
    tx: TransactionClient;
    files: Prisma.SubmissionFileCreateManyInput[];
  }) {
    const result = await tx.submissionFile.createMany({ data: files });
    return result;
  }
}
