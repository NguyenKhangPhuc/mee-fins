import { Test, TestingModule } from '@nestjs/testing';
import { VocabularyWordService } from './vocabulary_word.service';

describe('VocabularyWordService', () => {
  let service: VocabularyWordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VocabularyWordService],
    }).compile();

    service = module.get<VocabularyWordService>(VocabularyWordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
