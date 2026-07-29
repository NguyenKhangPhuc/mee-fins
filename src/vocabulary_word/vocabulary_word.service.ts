import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { WordCreationDto } from './dto/word-creation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { INTERNAL_SERVER_ERROR, NOT_EXISTED_WORD_ERROR } from 'src/constants/error-code';
import { WordUpdationDto } from './dto/word-updation.dto';
import { Prisma } from 'src/generated/prisma/client';
import { WordDeletionDto } from './dto/word-id-query.dto';

@Injectable()
export class VocabularyWordService {
    constructor(private readonly prismaService: PrismaService) { }

    async createVocabularyWord(body: WordCreationDto) {
        try {
            const result = await this.prismaService.vocabularyWord.create({ data: body })
            return result;
        } catch {
            throw new InternalServerErrorException({ message: "Fail to create the word", code: INTERNAL_SERVER_ERROR })
        }
    }

    async updateVocabularyWord(body: WordUpdationDto) {
        try {
            const result = await this.prismaService.vocabularyWord.update({ data: body, where: { id: body.id } })
            return result;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException({
                        message: 'Word not found',
                        code: NOT_EXISTED_WORD_ERROR,
                    });
                }
            }

            throw new InternalServerErrorException({ message: "Fail to update the word", code: INTERNAL_SERVER_ERROR })
        }
    }

    async deleteVocabularyWordById(body: WordDeletionDto) {
        try {
            const result = await this.prismaService.vocabularyWord.delete({
                where: { id: body.id }
            })
            return result;
        } catch {
            throw new InternalServerErrorException({ message: "Fail to delete the word", code: INTERNAL_SERVER_ERROR })
        }
    }
}
