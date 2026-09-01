import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { googleCallBackUrl, googleClient, googleSecret } from 'src/utils/config';
import { UsersService } from 'src/users/users.service';
import { GITHUB_EMAIL_NOT_FOUND } from 'src/constants/error-code';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private readonly usersService: UsersService) {
        super({
            clientID: googleClient as string,
            clientSecret: googleSecret as string,
            callbackURL: googleCallBackUrl as string,
            scope: ['email', 'profile'],
        });
    }
    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const email = profile.emails?.[0]?.value;
        const displayName = profile.displayName;
        if (!email) {
            throw new UnauthorizedException({
                message: 'Google account must have an email to login',
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