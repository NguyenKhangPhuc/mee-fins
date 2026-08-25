import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserLanguagesCreationDto } from './dto/user_languages-creation.dto';
import { INTERNAL_SERVER_ERROR } from 'src/constants/error-code';
import { UserLanguagesDeleteDto } from './dto/user_languages-delete.dto';
import { UserLanguagesUserIdDto } from './dto/user_languages-user_id.dto';
import { PROFICIENCY } from 'src/generated/prisma/enums';

@Injectable()
export class UserLanguagesService {
    constructor(private readonly prisma: PrismaService) { }

    async getAllUserLanguagesByUserId(body: UserLanguagesUserIdDto) {
        try {
            const userLanguages = await this.prisma.userLanguage.findMany({
                where: body
            })
            return userLanguages;
        } catch {
            throw new InternalServerErrorException({
                message: 'Failed to find all of the user languages',
                code: INTERNAL_SERVER_ERROR,
            });
        }
    }

    async createUserLanguage(body: UserLanguagesCreationDto) {
        try {
            const userLanguage = await this.prisma.userLanguage.create({
                data: body
            })
            return userLanguage;
        } catch (error) {
            console.log("this is the error when create user language", error)
            throw new InternalServerErrorException({
                message: 'Failed to create a new user language',
                code: INTERNAL_SERVER_ERROR,
            });
        }
    }

    async deleteUserLanguage(body: UserLanguagesDeleteDto) {
        try {
            const userLanguage = await this.prisma.userLanguage.delete({
                where: {
                    userId_languageId: {
                        userId: body.userId,
                        languageId: body.languageId,
                    },
                },
            })
            return userLanguage;
        } catch {
            throw new InternalServerErrorException({
                message: 'Failed to delete the user language',
                code: INTERNAL_SERVER_ERROR,
            });
        }
    }

    async getUserAdvancedLevelLanguage(userId: string) {
        try {
            const userLanguages = await this.prisma.userLanguage.findMany({
                where: { userId, proficiency: PROFICIENCY.ADVANCED }
            })
            return userLanguages;
        } catch {
            throw new InternalServerErrorException({
                message: 'Failed to find all of the user languages',
                code: INTERNAL_SERVER_ERROR,
            });
        }
    }

}