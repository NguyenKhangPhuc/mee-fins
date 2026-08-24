import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
    EXPIRED_ACCESS_TOKEN,
    INVALID_ACCESS_TOKEN,
} from 'src/constants/error-code';

@Injectable()
export class JwtAdminAuthGuard extends AuthGuard('jwt-admin') {
    handleRequest<SafeUser>(err: unknown, user: SafeUser, info: unknown) {
        if (info instanceof Error && info.name === 'TokenExpiredError') {
            throw new UnauthorizedException({
                statusCode: 401,
                message: 'Access token expired',
                code: EXPIRED_ACCESS_TOKEN,
            });
        }

        if (err instanceof Error) {
            throw err;
        }

        if (!user) {
            throw new UnauthorizedException({
                message: 'Invalid token, not authorized',
                code: INVALID_ACCESS_TOKEN,
            });
        }
        return user;
    }
}
