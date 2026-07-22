import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LanguageQueryDto } from './dto/language-query.dto';
import { INTERNAL_SERVER_ERROR } from 'src/constants/error-code';
import { LanguageCreationDto } from './dto/language-creation.dto';
import { LanguageDeleteDto } from './dto/language-delete.dto';

@Injectable()
export class LanguagesService {
    constructor(private readonly prisma: PrismaService) { }

    async getAllLanguages(body: LanguageQueryDto) {
        try {
            const languages = await this.prisma.language.findMany()
            return languages;
        } catch {
            throw new InternalServerErrorException({
                message: 'Failed to find all of the events',
                code: INTERNAL_SERVER_ERROR,
            });
        }
    }

    async createLanguage(body: LanguageCreationDto) {
        try {
            const language = await this.prisma.language.create({
                data: body
            })
            return language;
        } catch {
            throw new InternalServerErrorException({
                message: 'Failed to create language',
                code: INTERNAL_SERVER_ERROR,
            });
        }
    }

    async deleteLanguage(body: LanguageDeleteDto) {
        try {
            const language = await this.prisma.language.delete({
                where: body
            })
            return language;
        } catch {
            throw new InternalServerErrorException({
                message: 'Failed to delete language',
                code: INTERNAL_SERVER_ERROR,
            });
        }
    }
}