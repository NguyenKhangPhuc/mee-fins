import { Test, TestingModule } from '@nestjs/testing';
import { VocabularyCollectionService } from './vocabulary_collection.service';

describe('VocabularyCollectionService', () => {
  let service: VocabularyCollectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VocabularyCollectionService],
    }).compile();

    service = module.get<VocabularyCollectionService>(VocabularyCollectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
