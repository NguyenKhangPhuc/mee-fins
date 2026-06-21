import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionFilesController } from './submission_files.controller';

describe('SubmissionFilesController', () => {
  let controller: SubmissionFilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubmissionFilesController],
    }).compile();

    controller = module.get<SubmissionFilesController>(SubmissionFilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
