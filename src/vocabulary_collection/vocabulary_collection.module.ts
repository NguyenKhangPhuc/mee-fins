import { Module } from '@nestjs/common';
import { VocabularyCollectionService } from './vocabulary_collection.service';
import { VocabularyCollectionController } from './vocabulary_collection.controller';

@Module({
  providers: [VocabularyCollectionService],
  controllers: [VocabularyCollectionController],
  exports: [VocabularyCollectionService]
})
export class VocabularyCollectionModule { }
