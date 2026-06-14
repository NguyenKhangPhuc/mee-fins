// src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { jwtRefreshSecret } from 'src/utils/config';
import { SignedRefreshToken } from 'src/types/tokens';
import { NOT_EXISTED_USER_ERROR } from 'src/constants/error-code';
import { RefreshTokenService } from '../refresh-tokens/auth.refresh-tokens.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    private refreshTokenService: RefreshTokenService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const cookies = req.cookies as Record<string, string> | undefined;
          console.log(cookies?.refresh_token);
          return cookies?.refresh_token ?? null;
        },
      ]),

      ignoreExpiration: false,
      secretOrKey: jwtRefreshSecret as string,
    });
  }

  async validate(payload: SignedRefreshToken) {
    await this.refreshTokenService.revokeRefreshToken({
      payload,
    });

    const user = await this.usersService.findOne({ id: payload.userId });
    console.log(user);
    if (!user) {
      throw new UnauthorizedException({
        message: 'User not found',
        code: NOT_EXISTED_USER_ERROR,
      });
    }

    return user;
  }
}
