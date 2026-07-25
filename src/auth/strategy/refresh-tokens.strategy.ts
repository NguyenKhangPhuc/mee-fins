import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { jwtRefreshSecret } from 'src/utils/config';
import { SignedRefreshToken } from 'src/types/tokens';
import { NOT_EXISTED_USER_ERROR } from 'src/constants/error-code';
import { RefreshTokenService } from '../refresh-tokens/auth.refresh-tokens.service';

function parseCookie(cookieHeader: string | undefined, name: string): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

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
          let token = cookies?.refresh_token;

          console.log(`this is the refresh token: ${token} - this is the cookies: ${JSON.stringify(cookies || {})} - raw headers cookie: ${req.headers?.cookie}`);
          return token ?? null;
        },
      ]),

      ignoreExpiration: false,
      secretOrKey: jwtRefreshSecret as string,
    });
  }

  async validate(payload: SignedRefreshToken) {
    console.log(`this is the payload: ${JSON.stringify(payload)}`);
    await this.refreshTokenService.revokeRefreshToken({
      payload,
    });

    const user = await this.usersService.findOne({ id: payload.userId });
    console.log(`this is the user: ${JSON.stringify(user)}`);
    if (!user) {
      throw new UnauthorizedException({
        message: 'User not found',
        code: NOT_EXISTED_USER_ERROR,
      });
    }

    return user;
  }
}
