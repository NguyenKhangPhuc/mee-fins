import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { SafeUser } from 'src/types/safe-user';
import { AuthService } from '../auth.service';
import { INVALID_CREDENTIALS_ERROR, USER_NOT_VERIFIED } from 'src/constants/error-code';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string): Promise<SafeUser> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException({
        message: 'Invalid Credentials',
        code: INVALID_CREDENTIALS_ERROR,
      });
    }
    if (user.confirmationAt == null) {
      throw new UnauthorizedException({
        message: "Verification code is sent through your email, please verify", code: USER_NOT_VERIFIED
      })
    }
    return user;
  }
}
