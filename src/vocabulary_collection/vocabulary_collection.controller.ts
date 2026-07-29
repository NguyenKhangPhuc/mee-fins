import { Body, Controller, Delete, Get, Param, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import type { SafeUser } from 'src/types/safe-user';
import { CollectionIdQueryDto } from './dto/collection-deletion.dto';
import { VocabularyCollectionService } from './vocabulary_collection.service';
import { CollectionCreationDto } from './dto/collection-creation.dto';
import { UNAUTHORIZED } from 'src/constants/error-code';
import { CollectionUpdationDto } from './dto/collection-updation.dto';

@Controller('vocabulary-collection')
export class VocabularyCollectionController {
    constructor(private readonly collectionService: VocabularyCollectionService) { }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getSingleCollectionWithWords(@CurrentUser() user: SafeUser, @Param() params: CollectionIdQueryDto) {
        const result = await this.collectionService.getSingleCollectionWithWords(params, user.id)
        return result
    }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    async createCollection(@CurrentUser() user: SafeUser, @Body() body: CollectionCreationDto) {
        if (user.id != body.ownerId) {
            throw new UnauthorizedException({ message: "You are not allowed to do this action", code: UNAUTHORIZED })
        }

        const result = await this.collectionService.createCollection(body)
        return result
    }

    @Delete('delete')
    @UseGuards(JwtAuthGuard)
    async deleteCollectionById(@CurrentUser() user: SafeUser, @Body() body: CollectionIdQueryDto) {
        const result = await this.collectionService.deleteCollectionById(body, user.id)
        return result
    }

    @Post('update')
    @UseGuards(JwtAuthGuard)
    async updateCollectionById(@CurrentUser() user: SafeUser, @Body() body: CollectionUpdationDto) {
        if (user.id != body.ownerId) {
            throw new UnauthorizedException({ message: "You are not allowed to do this action", code: UNAUTHORIZED })
        }
        const result = await this.collectionService.updateCollection(body)
        return result
    }
}
