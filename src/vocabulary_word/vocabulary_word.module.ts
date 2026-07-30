import { Module } from '@nestjs/common';
import { VocabularyWordService } from './vocabulary_word.service';
import { VocabularyWordController } from './vocabulary_word.controller';
import { VocabularyCollectionModule } from 'src/vocabulary_collection/vocabulary_collection.module';

@Module({
  providers: [VocabularyWordService],
  controllers: [VocabularyWordController],
  imports: [VocabularyCollectionModule]
})
export class VocabularyWordModule { }
