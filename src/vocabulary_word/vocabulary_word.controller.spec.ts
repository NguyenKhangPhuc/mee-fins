import { Test, TestingModule } from '@nestjs/testing';
import { VocabularyWordController } from './vocabulary_word.controller';

describe('VocabularyWordController', () => {
  let controller: VocabularyWordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VocabularyWordController],
    }).compile();

    controller = module.get<VocabularyWordController>(VocabularyWordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
