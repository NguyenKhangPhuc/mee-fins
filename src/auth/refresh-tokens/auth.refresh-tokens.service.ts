import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
          throw new ConflictException('Refresh token already exists');
        }
      }
      throw new InternalServerErrorException('Failed to create refresh token');
    }
  }

  async findRefreshToken({
    refreshTokenWhere,
  }: {
    refreshTokenWhere: Prisma.RefreshTokenWhereUniqueInput;
  }) {
    try {
      const result = await this.prismaService.refreshToken.findUnique({
        where: refreshTokenWhere,
      });
      return result;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Refresh token not found');
      }
      throw new InternalServerErrorException('Fail to find the refresh token');
    }
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
        throw new NotFoundException('Refresh token not found');
      }
      throw new InternalServerErrorException(
        'Fail to revoke the refresh token',
      );
    }
  }
}
