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

@Injectable()
export class ProfileService {
  constructor(private prismaService: PrismaService) {}
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
}
