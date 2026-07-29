import { Body, Controller, Delete, Get, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import type { SafeUser } from 'src/types/safe-user';
import { WordCreationDto } from './dto/word-creation.dto';
import { VocabularyCollectionService } from 'src/vocabulary_collection/vocabulary_collection.service';
import { VocabularyWordService } from './vocabulary_word.service';
import { WordUpdationDto } from './dto/word-updation.dto';
import { UNAUTHORIZED } from 'src/constants/error-code';
import { WordDeletionDto } from './dto/word-id-query.dto';

@Controller('vocabulary-word')
export class VocabularyWordController {
    constructor(private readonly collectionService: VocabularyCollectionService, private readonly wordService: VocabularyWordService) { }
    @Post('create')
    @UseGuards(JwtAuthGuard)
    async createWord(@CurrentUser() user: SafeUser, @Body() body: WordCreationDto) {
        const isOwner = await this.collectionService.isCollectionOwnedByUser(body.collectionId, user.id)
        if (!isOwner) {
            throw new UnauthorizedException({ message: "You are not allowed to do this", code: UNAUTHORIZED })
        }
        const result = await this.wordService.createVocabularyWord(body)
        return result;
    }
    @Post('update')
    @UseGuards(JwtAuthGuard)
    async updateWord(@CurrentUser() user: SafeUser, @Body() body: WordUpdationDto) {
        const isOwner = await this.collectionService.isCollectionOwnedByUser(body.collectionId, user.id)
        if (!isOwner) {
            throw new UnauthorizedException({ message: "You are not allowed to do this", code: UNAUTHORIZED })
        }
        const result = await this.wordService.updateVocabularyWord(body)
        return result;
    }

    @Delete('delete')
    @UseGuards(JwtAuthGuard)
    async deleteWordById(@CurrentUser() user: SafeUser, @Body() body: WordDeletionDto) {
        const isOwner = await this.collectionService.isCollectionOwnedByUser(body.collectionId, user.id)
        if (!isOwner) {
            throw new UnauthorizedException({ message: "You are not allowed to do this", code: UNAUTHORIZED })
        }
        const result = await this.wordService.deleteVocabularyWordById(body)
        return result;
    }
}
