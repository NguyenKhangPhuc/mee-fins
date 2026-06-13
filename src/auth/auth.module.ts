import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtSecret } from 'src/utils/config';
import { UsersModule } from 'src/users/users.module';
import { RefreshTokenModule } from './refresh-tokens/auth.refresh-tokens.module';
import { SessionModule } from './sessions/auth.session.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UsersModule,
    PassportModule,
    RefreshTokenModule,
    SessionModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
