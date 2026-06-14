import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';
import { GITHUB_EMAIL_NOT_FOUND } from 'src/constants/error-code';
import { UsersService } from 'src/users/users.service';
import {
  githubCallBackUrl,
  githubClient,
  githubSecret,
} from 'src/utils/config';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private usersService: UsersService) {
    super({
      clientID: githubClient as string,
      clientSecret: githubSecret as string,
      callbackURL: githubCallBackUrl as string,
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const email = profile.emails?.[0]?.value;
    const displayName = profile.displayName;
    if (!email) {
      throw new UnauthorizedException({
        message: 'GitHub account must have a public email to login',
        code: GITHUB_EMAIL_NOT_FOUND,
      });
    }
    const user = await this.usersService.handleOauthLogin({
      email,
      displayName,
    });

    return user;
  }
}
