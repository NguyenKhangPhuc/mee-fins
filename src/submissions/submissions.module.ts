import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { SubmissionFilesModule } from 'src/submission_files/submission_files.module';
import { FunFactsModule } from 'src/fun_facts/fun_facts.module';
import { FileModule } from 'src/file/file.module';

@Module({
  providers: [SubmissionsService],
  controllers: [SubmissionsController],
  imports: [SubmissionFilesModule, FunFactsModule, FileModule],
})
export class SubmissionsModule {}
