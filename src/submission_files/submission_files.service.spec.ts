import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionFilesService } from './submission_files.service';

describe('SubmissionFilesService', () => {
  let service: SubmissionFilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubmissionFilesService],
    }).compile();

    service = module.get<SubmissionFilesService>(SubmissionFilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
