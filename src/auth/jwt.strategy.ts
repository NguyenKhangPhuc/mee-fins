// src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { jwtSecret } from 'src/utils/config';
import { SignedAccessToken } from 'src/types/tokens';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const cookies = req.cookies as Record<string, string> | undefined;
          return cookies?.access_token ?? null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret as string,
    });
  }

  async validate(payload: SignedAccessToken) {
    const user = await this.usersService.findOne({ id: payload.id });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
