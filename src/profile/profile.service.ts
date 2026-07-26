import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileUpdationDto } from './dto/profile-updation.dto';
import {
  INTERNAL_SERVER_ERROR,
  NOT_EXISTED_USER_ERROR,
} from 'src/constants/error-code';
import { ProfileRoleDto } from './dto/role-updation.dto';
import { FileService } from 'src/file/file.service';

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
        console.log("Error in !poster" + error)
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
        console.log(error + "Error in upload and update file")
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

  async getUserProfileWithLanguageAndSlots() {
    try {
      const result = await this.prismaService.profile.findMany({
        include: {
          userlanguage: true,
          provideSlots: true,
        }
      })
      return result;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Fail to get user language and slots',
        code: INTERNAL_SERVER_ERROR,
      });
    }
  }
}
