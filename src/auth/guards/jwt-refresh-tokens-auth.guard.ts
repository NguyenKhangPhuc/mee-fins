import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  EXPIRED_REFRESH_TOKEN,
  INVALID_REFRESH_TOKEN,
} from 'src/constants/error-code';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('refresh-jwt') {
  handleRequest<SafeUser>(err: unknown, user: SafeUser, info: unknown) {
    if (info instanceof Error && info.name === 'TokenExpiredError') {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Refresh token expired',
        code: EXPIRED_REFRESH_TOKEN,
      });
    }

    if (err instanceof Error) {
      throw err;
    }

    if (!user) {
      throw new UnauthorizedException({
        message: 'Invalid refresh token, not authorized',
        code: INVALID_REFRESH_TOKEN,
      });
    }
    return user;
  }
}
