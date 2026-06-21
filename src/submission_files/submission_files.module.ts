import { Module } from '@nestjs/common';
import { SubmissionFilesController } from './submission_files.controller';
import { SubmissionFilesService } from './submission_files.service';

@Module({
  controllers: [SubmissionFilesController],
  providers: [SubmissionFilesService],
  exports: [SubmissionFilesService],
})
export class SubmissionFilesModule {}
