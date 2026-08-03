import { Module } from '@nestjs/common';
import { VerificationCodeService } from './verification_code.service';
import { VerificationCodeController } from './verification_code.controller';

@Module({
  providers: [VerificationCodeService],
  controllers: [VerificationCodeController]
})
export class VerificationCodeModule {}
