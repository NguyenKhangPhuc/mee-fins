import {
  Body,
  Controller,
  Get,
  Ip,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { CookieOptions, Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import type { SafeUser } from 'src/types/safe-user';
import { SignUpDto } from './dtos/signup.dto';
import { RefreshTokenService } from './refresh-tokens/auth.refresh-tokens.service';
import { SessionService } from './sessions/auth.session.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-tokens-auth.guard';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { cookieDomain, frontendUrl } from 'src/utils/config';
import { PasswordUpdationDto } from './dtos/password-updation.dto';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
    private refreshTokenService: RefreshTokenService,
  ) { }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: SafeUser,
    @Req() req: Request,
    @Ip() ip: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.accessToken(user);

    const { refreshTokenResult } = await this.authService.login({
      user: user,
      ip: ip,
      userAgent: req.headers['user-agent'],
    });

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    };

    response.cookie('access_token', result.access_token, cookieOptions);
    response.cookie('refresh_token', refreshTokenResult.refresh_token, cookieOptions);

    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @CurrentUser() user: SafeUser,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rawRefreshToken = req.cookies?.refresh_token as string | undefined;
    if (rawRefreshToken) {
      const payload =
        await this.authService.verifyRefreshToken(rawRefreshToken);
      await this.refreshTokenService.revokeRefreshToken({ payload });
      await this.sessionService.removeSession({ id: payload.sessionId });
    }

    const clearCookieOptions: CookieOptions = {
      path: '/',
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    };

    res.clearCookie('access_token', clearCookieOptions);
    res.clearCookie('refresh_token', clearCookieOptions);
    return { success: true };
  }

  @Post('signup')
  async signup(@Body() body: SignUpDto) {
    await this.authService.signUp(body);
    return { success: true };
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refreshToken(
    @CurrentUser() user: SafeUser,
    @Req() req: Request,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.login(user, req, ip, res);
  }

  @Get('github')
  @UseGuards(GithubAuthGuard)
  githubLogin() { }

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  async githubCallback(
    @CurrentUser() user: SafeUser,
    @Ip() ip: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.login(user, req, ip, res);
    return res.redirect(frontendUrl as string);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  getUser(@CurrentUser() user: SafeUser) {
    return user;
  }

  @Post('update-password')
  async updateUserPassword(@Body() body: PasswordUpdationDto) {
    await this.authService.updatePassword(body)
  }
}
