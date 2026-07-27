import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { jwtSecret } from 'src/utils/config';
import { SignedAccessToken } from 'src/types/tokens';
import { NOT_EXISTED_USER_ERROR } from 'src/constants/error-code';

function parseCookie(cookieHeader: string | undefined, name: string): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const cookies = req.cookies as Record<string, string> | undefined;
          if (cookies?.access_token) {
            return cookies.access_token;
          }
          const rawHeaderCookie = req.headers?.cookie as string | undefined;

          return parseCookie(rawHeaderCookie, 'access_token');
        },
      ]),

      ignoreExpiration: false,
      secretOrKey: jwtSecret as string,
    });
  }

  async validate(payload: SignedAccessToken) {
    const user = await this.usersService.findOne({ id: payload.id });

    if (!user) {
      throw new UnauthorizedException({
        message: 'User not found',
        code: NOT_EXISTED_USER_ERROR,
      });
    }

    return user;
  }
}
