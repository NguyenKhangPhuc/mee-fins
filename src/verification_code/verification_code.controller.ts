import { Body, Controller, Post } from '@nestjs/common';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { VerificationCodeService } from './verification_code.service';

@Controller('verification-code')
export class VerificationCodeController {
    constructor(private readonly verificationCodeService: VerificationCodeService) { }

    @Post('sign-up')
    async generateSignUpCode(@Body() body: VerifyCodeDto) {
        await this.verificationCodeService.generateVerificationCode(body)
    }
}
