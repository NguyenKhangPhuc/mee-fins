import { Body, Controller, Post } from '@nestjs/common';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { VerificationCodeService } from './verification_code.service';
import { GenerateCodeDto } from './dto/generate-code.dto';

@Controller('verification-code')
export class VerificationCodeController {
    constructor(private readonly verificationCodeService: VerificationCodeService) { }

    @Post('sign-up')
    async generateSignUpCode(@Body() body: GenerateCodeDto) {
        await this.verificationCodeService.generateVerificationCode(body)
    }

    @Post('verify-sign-up')
    async verifySignUpCode(@Body() body: VerifyCodeDto) {
        await this.verificationCodeService.verifyVerificationCode(body)
    }
    @Post('forget-pww')
    async generateForgetPwCode(@Body() body: GenerateCodeDto) {
        await this.verificationCodeService.generateForgetPasswordCode(body)
    }

    @Post('verify-forget-pw')
    async verifyForgetPwCode(@Body() body: VerifyCodeDto) {
        await this.verificationCodeService.verifyForgetPasswordCode(body)
    }
}
