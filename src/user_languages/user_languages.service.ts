import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserLanguagesCreationDto } from './dto/user_languages-creation.dto';
import { INTERNAL_SERVER_ERROR } from 'src/constants/error-code';
import { UserLanguagesDeleteDto } from './dto/user_languages-delete.dto';
import { UserLanguagesUserIdDto } from './dto/user_languages-user_id.dto';
import { PROFICIENCY } from 'src/generated/prisma/enums';
import { ProfileService } from 'src/profile/profile.service';

@Injectable()
export class UserLanguagesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly profileService: ProfileService,
    ) { }

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
            const { timezone, ...userLanguageData } = body;
            const userLanguage = await this.prisma.userLanguage.create({
                data: userLanguageData
            });

            if (timezone) {
                await this.profileService.updateProfileTimeZone({
                    id: body.userId,
                    timezone,
                });
            }

            return userLanguage;
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'Failed to create a new user language',
                code: INTERNAL_SERVER_ERROR,
            });
        }
    }

    async deleteUserLanguage(userId: string, body: UserLanguagesDeleteDto) {
        try {
            const userLanguage = await this.prisma.userLanguage.delete({
                where: {
                    userId_languageId: {
                        userId: userId,
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