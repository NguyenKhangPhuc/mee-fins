import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import type { SafeUser } from 'src/generated/prisma/client';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: SafeUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(user);
    response.cookie('access-token', result.access_token, { httpOnly: true });
    return { success: true };
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  logout(@Req() req: Request) {
    return req.logout();
  }
}
