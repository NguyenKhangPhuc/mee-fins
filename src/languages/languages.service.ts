import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LanguageQueryDto } from './dto/language-query.dto';
import { INTERNAL_SERVER_ERROR, NOT_EXISTED_LANGUAGE_ERROR } from 'src/constants/error-code';
import { LanguageCreationDto } from './dto/language-creation.dto';
import { LanguageDeleteDto } from './dto/language-delete.dto';
import { LanguageUpdationDto } from './dto/language-updation.dto';
import { Prisma } from 'src/generated/prisma/client';

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
    async updateLanguageByLanguageId(body: LanguageUpdationDto) {
        try {
            const { id, ...updateData } = body;
            const language = await this.prisma.language.update({
                where: { id },
                data: updateData,
            });
            return language;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code == 'P2025') {
                throw new NotFoundException({ message: "Language not found", code: NOT_EXISTED_LANGUAGE_ERROR })
            }
            throw new InternalServerErrorException({ message: "Failed to update the language", code: INTERNAL_SERVER_ERROR })
        }
    }
}