import { Test, TestingModule } from '@nestjs/testing';
import { VocabularyCollectionController } from './vocabulary_collection.controller';

describe('VocabularyCollectionController', () => {
  let controller: VocabularyCollectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VocabularyCollectionController],
    }).compile();

    controller = module.get<VocabularyCollectionController>(VocabularyCollectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
