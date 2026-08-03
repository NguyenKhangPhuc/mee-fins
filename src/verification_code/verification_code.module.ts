import { Module } from '@nestjs/common';
import { VerificationCodeService } from './verification_code.service';
import { VerificationCodeController } from './verification_code.controller';
import { EmailModule } from 'src/email/email.module';

@Module({
  providers: [VerificationCodeService],
  controllers: [VerificationCodeController],
  imports: [EmailModule],
  exports: [VerificationCodeService]
})
export class VerificationCodeModule { }
