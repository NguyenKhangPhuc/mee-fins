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
  INVALID_CREDENTIALS_ERROR,
  INVALID_REFRESH_TOKEN,
} from 'src/constants/error-code';
import { jwtRefreshSecret, jwtSecret } from 'src/utils/config';
import { VerificationDto } from './dtos/verification.dto';
import { EmailService } from 'src/email/email.service';
import getSignUpEmailTemplate from 'src/helpers/email/sign-up-template';
import { VerificationCodeService } from 'src/verification_code/verification_code.service';
import { PasswordUpdationDto } from './dtos/password-updation.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
    private verificationCodeService: VerificationCodeService,

  ) { }

  async validateUser(
    username: string,
    pass: string,
  ): Promise<SafeUser | undefined> {
    const user = await this.usersService.findOne({ email: username });
    if (!user?.passwordHash) {
      return undefined;
    }
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
      role: user.role
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: jwtSecret,
      expiresIn: '30s',
    });
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
    const token = await this.jwtService.signAsync(payload, {
      secret: jwtRefreshSecret,
    });
    return { refresh_token: token, jti };
  }

  async verifyRefreshToken(rawRefreshToken: string) {
    try {
      const result = await this.jwtService.verifyAsync<SignedRefreshToken>(
        rawRefreshToken,
        { secret: jwtRefreshSecret },
      );
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
      email: email.toLowerCase(),
      passwordHash: hashPassword,
    };
    const verificationCode = await this.usersService.createUser({ user: newuser });
    await this.emailService.send(email, "MeeFins - Sign up verification code", getSignUpEmailTemplate(displayName, verificationCode.code))
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

  async updatePassword(body: PasswordUpdationDto) {
    await this.verificationCodeService.verifyForgetPasswordCode(body)
    const user = await this.validateUser(body.email, body.oldPassword)
    if (!user) {
      throw new UnauthorizedException({
        message: 'Invalid old credentials',
        code: INVALID_CREDENTIALS_ERROR,
      });
    }
    const newHashPassword = await bcrypt.hash(body.newPassword, saltOrRounds);

    await this.usersService.updatePassword(body.email, newHashPassword)
  }


}
