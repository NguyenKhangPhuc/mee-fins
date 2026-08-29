import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, SlotStatus } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileUpdationDto } from './dto/profile-updation.dto';
import { TimeZoneUpdationDto } from './dto/timezone-updation.dto';
import {
  INTERNAL_SERVER_ERROR,
  NOT_EXISTED_USER_ERROR,
} from 'src/constants/error-code';
import { ProfileRoleDto } from './dto/role-updation.dto';
import { FileService } from 'src/file/file.service';
import { PaginationDto } from 'src/helpers/pagination/dto/pagination.dto';
import { getPaginationParams } from 'src/helpers/pagination/parsing-pagination-query';
import { ProfileWithScore } from 'src/types/profile';
import { paginate } from 'src/helpers/pagination/parseing-pagination-result';
import { getProfileRawQuery } from 'src/helpers/pagination/pagination-profile-query';

@Injectable()
export class ProfileService {
  constructor(
    private prismaService: PrismaService,
    private fileService: FileService,
  ) { }
  async createProfile({
    tx,
    profile,
  }: {
    tx: Prisma.TransactionClient;
    profile: Prisma.ProfileUncheckedCreateInput;
  }) {
    const result = await tx.profile.create({ data: profile });
    return result;
  }
  async updateProfile(profile: ProfileUpdationDto) {
    try {
      const result = await this.prismaService.profile.update({
        data: profile,
        where: { id: profile.id },
      });
      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException({
            message: 'User not found',
            code: NOT_EXISTED_USER_ERROR,
          });
        }
      }
      throw new InternalServerErrorException({
        message: 'Fail to update user information',
        code: INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateProfileTimeZone(dto: TimeZoneUpdationDto) {
    try {
      const result = await this.prismaService.profile.update({
        data: { timezone: dto.timezone },
        where: { id: dto.id },
      });
      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException({
            message: 'User not found',
            code: NOT_EXISTED_USER_ERROR,
          });
        }
      }
      throw new InternalServerErrorException({
        message: 'Fail to update user timezone',
        code: INTERNAL_SERVER_ERROR,
      });
    }
  }
  // async updateProfileRole(profileRole: ProfileRoleDto) {
  //   try {
  //     const result = await this.prismaService.profile.update({
  //       data: { role: profileRole.role },
  //       where: { id: profileRole.id },
  //     });
  //     return result;
  //   } catch (error) {
  //     if (error instanceof Prisma.PrismaClientKnownRequestError) {
  //       if (error.code === 'P2025') {
  //         throw new NotFoundException({
  //           message: 'User not found',
  //           code: NOT_EXISTED_USER_ERROR,
  //         });
  //       }
  //     }
  //     throw new InternalServerErrorException({
  //       message: 'Fail to update user role',
  //       code: INTERNAL_SERVER_ERROR,
  //     });
  //   }
  // }

  async updateProfilePoster({
    poster,
    userId,
    oldPosterKey,
  }: {
    poster: Express.Multer.File | undefined;
    userId: string;
    oldPosterKey: string | undefined;
  }) {
    if (oldPosterKey) {
      await this.fileService.deleteFile(oldPosterKey);
    }
    if (!poster) {
      try {
        await this.prismaService.profile.update({
          data: { avatarKey: null, avatarUrl: null },
          where: { id: userId },
        });
        return { success: true };
      } catch (error) {
        if (error instanceof InternalServerErrorException) {
          throw error;
        }
        throw new InternalServerErrorException({
          message: 'Fail to update profile avatar',
          code: INTERNAL_SERVER_ERROR,
        });
      }
    } else {
      const result = await this.fileService.uploadFile(poster, userId);
      try {
        await this.prismaService.profile.update({
          data: { avatarKey: result.key, avatarUrl: result.publicUrl },
          where: { id: userId },
        });
        return { success: true };
      } catch (error) {
        await this.fileService.deleteFile(result.key);
        throw new InternalServerErrorException({
          message: 'Fail to update profile avatar',
          code: INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  async getUserProfile(userId: string) {
    try {
      const result = await this.prismaService.profile.findUnique({ where: { id: userId } })
      return result
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException({
            message: 'User not found',
            code: NOT_EXISTED_USER_ERROR,
          });
        }
      }
      throw new InternalServerErrorException({
        message: 'Fail to get user information',
        code: INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getUserProfileWithLanguageAndSlots(currentUserId: string, query: PaginationDto) {
    try {
      const today = new Date();
      const { limit, page, skip } = getPaginationParams(query)
      const result = await this.prismaService.$queryRaw<ProfileWithScore[]>(getProfileRawQuery(today, currentUserId, limit, skip))
      const total = await this.prismaService.profile.count() - 1;

      return paginate(result, total, page, limit);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Fail to get user language and slots',
        code: INTERNAL_SERVER_ERROR,
      });
    }
  }


  async getUserProfileWithLanguageAndSlotsById(currentUserId: string) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const result = await this.prismaService.profile.findFirst({
        where: {
          id: currentUserId
        },
        include: {
          userlanguage: true,
          provideSlots: {
            where: {
              startTime: {
                gte: today,
              },
            },
            include: {
              provideLanguage: true,
              exchangeLanguage: true,
            },
          },
          exchangeSlots: {
            where: {
              startTime: {
                gte: today,
              },
            },
            include: {
              provideLanguage: true,
              exchangeLanguage: true,
            },
          }
        },
      });
      return result;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Fail to get user language and slots',
        code: INTERNAL_SERVER_ERROR,
      });
    }
  }
}
