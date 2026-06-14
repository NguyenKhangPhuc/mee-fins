import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  EXISTED_REFRESH_TOKEN,
  INTERNAL_SERVER_ERROR,
  NOT_EXISTED_REFRESH_TOKEN,
} from 'src/constants/error-code';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

import { SignedRefreshToken } from 'src/types/tokens';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createRefreshToken(
    refreshToken: Prisma.RefreshTokenUncheckedCreateInput,
  ) {
    try {
      return await this.prismaService.refreshToken.create({
        data: refreshToken,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException({
            message: 'Refresh token already exists',
            code: EXISTED_REFRESH_TOKEN,
          });
        }
      }
      throw new InternalServerErrorException({
        message: 'Failed to create refresh token',
        code: INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findRefreshToken(
    refreshTokenWhere: Prisma.RefreshTokenWhereUniqueInput,
  ) {
    const result = await this.prismaService.refreshToken.findUnique({
      where: refreshTokenWhere,
    });
    if (!result) {
      throw new NotFoundException({
        message: 'Refresh token not found',
        code: NOT_EXISTED_REFRESH_TOKEN,
      });
    }
    return result;
  }

  async revokeRefreshToken({ payload }: { payload: SignedRefreshToken }) {
    try {
      await this.prismaService.refreshToken.update({
        where: { jti: payload.jti, isRevoked: false },
        data: { isRevoked: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException({
          message: 'Refresh token not found',
          code: NOT_EXISTED_REFRESH_TOKEN,
        });
      }
      throw new InternalServerErrorException({
        message: 'Fail to revoke the refresh token',
        code: INTERNAL_SERVER_ERROR,
      });
    }
  }
}
