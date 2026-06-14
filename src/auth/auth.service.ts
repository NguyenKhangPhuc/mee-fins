import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { SafeUser } from 'src/types/safe-user';
import { v4 as uuidv4 } from 'uuid';
import { SignedAccessToken, SignedRefreshToken } from 'src/types/tokens';
import { Prisma } from 'src/generated/prisma/client';
import { saltOrRounds } from 'src/constants';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  EXPIRED_REFRESH_TOKEN,
  INVALID_REFRESH_TOKEN,
} from 'src/constants/error-code';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<SafeUser | undefined> {
    const user = await this.usersService.findOne({ email: username });
    if (user) {
      const isMatch = await bcrypt.compare(pass, user.passwordHash);
      if (isMatch) {
        const { passwordHash: _passwordHash, ...result } = user;
        return result;
      }
    }
  }

  async accessToken(user: SafeUser) {
    const payload: SignedAccessToken = {
      username: user.email,
      id: user.id,
      displayName: user.displayName,
    };
    const token = await this.jwtService.signAsync(payload);
    return {
      access_token: token,
    };
  }

  async refreshToken({
    sessionId,
    userId,
  }: {
    sessionId: string;
    userId: string;
  }) {
    const jti = uuidv4();
    const payload: SignedRefreshToken = {
      sessionId,
      userId,
      jti,
    };
    const token = await this.jwtService.signAsync(payload);
    return { refresh_token: token, jti };
  }

  async verifyRefreshToken(rawRefreshToken: string) {
    try {
      const result =
        await this.jwtService.verifyAsync<SignedRefreshToken>(rawRefreshToken);
      return result;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException({
          message: 'Your session has expired, please login again',
          code: EXPIRED_REFRESH_TOKEN,
        });
      }
      throw new UnauthorizedException({
        message: 'Invalid refresh token',
        code: INVALID_REFRESH_TOKEN,
      });
    }
  }

  async signUp({
    displayName,
    email,
    password,
  }: {
    displayName: string;
    email: string;
    password: string;
  }) {
    const hashPassword = await bcrypt.hash(password, saltOrRounds);
    const newuser: Prisma.UserUncheckedCreateInput = {
      displayName,
      email,
      passwordHash: hashPassword,
    };
    await this.usersService.createUser({ user: newuser });
  }

  async login({
    user,
    ip,
    userAgent,
  }: {
    user: SafeUser;
    ip: string;
    userAgent: string | undefined;
  }) {
    return await this.prismaService.$transaction(async (tx) => {
      const sessionInput: Prisma.SessionUncheckedCreateInput = {
        userId: user.id,
        userAgent: userAgent,
        ipAddress: ip,
      };

      const sessionResponse = await tx.session.create({
        data: sessionInput,
      });

      const refreshTokenResult = await this.refreshToken({
        sessionId: sessionResponse.id,
        userId: user.id,
      });

      const refreshTokenInput: Prisma.RefreshTokenUncheckedCreateInput = {
        jti: refreshTokenResult.jti,
        userId: user.id,
        isRevoked: false,
        sessionId: sessionResponse.id,
      };

      await tx.refreshToken.create({ data: refreshTokenInput });

      return { refreshTokenResult };
    });
  }
}
