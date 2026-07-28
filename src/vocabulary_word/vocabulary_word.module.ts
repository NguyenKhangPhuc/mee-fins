import { Module } from '@nestjs/common';
import { VocabularyWordService } from './vocabulary_word.service';
import { VocabularyWordController } from './vocabulary_word.controller';

@Module({
  providers: [VocabularyWordService],
  controllers: [VocabularyWordController]
})
export class VocabularyWordModule {}
