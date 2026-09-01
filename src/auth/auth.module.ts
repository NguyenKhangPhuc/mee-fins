import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { RefreshTokenModule } from './refresh-tokens/auth.refresh-tokens.module';
import { SessionModule } from './sessions/auth.session.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtStrategyAdmin } from './strategy/jwt-admin.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtRefreshStrategy } from './strategy/refresh-tokens.strategy';
import { GithubStrategy } from './strategy/github.strategy';
import { EmailModule } from 'src/email/email.module';
import { VerificationCodeModule } from 'src/verification_code/verification_code.module';
import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtStrategyAdmin,
    JwtRefreshStrategy,
    GithubStrategy,
    GoogleStrategy
  ],
  imports: [
    UsersModule,
    PassportModule,
    RefreshTokenModule,
    SessionModule,
    JwtModule.register({}),
    EmailModule,
    VerificationCodeModule
  ],
  exports: [AuthService],
})
export class AuthModule { }
