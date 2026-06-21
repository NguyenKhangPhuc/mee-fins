import { Injectable } from '@nestjs/common';
import { SubmissionCreationDto } from './dto/submission-creation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';
import { FunFactsService } from 'src/fun_facts/fun_facts.service';
import { SubmissionFilesService } from 'src/submission_files/submission_files.service';
import { FileService } from 'src/file/file.service';

@Injectable()
export class SubmissionsService {
  constructor(
    private prismaService: PrismaService,
    private factService: FunFactsService,
    private submissionFileService: SubmissionFilesService,
    private fileService: FileService,
  ) {}
  async createSubmission({
    tx,
    submission,
  }: {
    tx: Prisma.TransactionClient;
    submission: Prisma.SubmissionUncheckedCreateInput;
  }) {
    const result = await tx.submission.create({ data: submission });
    return result;
  }
  async createSubmissionWithFilesAndFunFacts(body: SubmissionCreationDto) {
    await this.prismaService.$transaction(async (tx) => {
      const createdSubmission = await this.createSubmission({
        tx,
        submission: body.submission,
      });
      const funFacts: Prisma.FunFactCreateManyInput[] = body.funFacts.map(
        (fact) => {
          return {
            fact: fact.fact,
            submissionId: createdSubmission.id,
          };
        },
      );
      await this.factService.createManyFunFacts({ tx, funFacts });
      if (!body.submissionFiles || body.submissionFiles.length == 0) {
        return;
      }
      const submissionFiles: Prisma.SubmissionFileCreateManyInput[] =
        await Promise.all(
          body.submissionFiles.map(async (file) => {
            const storedFileInfo = await this.fileService.uploadFile(
              file,
              createdSubmission.id,
            );
            return {
              groupId: body.submission.groupId,
              submissionId: createdSubmission.id,
              key: storedFileInfo.key,
              storagePath: storedFileInfo.publicUrl,
              originalFileName: file.originalname,
              mimeType: file.mimetype,
              size: file.size,
            };
          }),
        );
      await this.submissionFileService.createManySubmissionFile({
        tx,
        files: submissionFiles,
      });
    });
  }
}
