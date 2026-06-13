import { Module } from '@nestjs/common';
import { RefreshTokenService } from './auth.refresh-tokens.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtSecret } from 'src/utils/config';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [RefreshTokenService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
