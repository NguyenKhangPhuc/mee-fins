import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { EXPIRED_ACCESS_TOKEN, INCORRECT_CODE, INTERNAL_SERVER_ERROR, NOT_EXISTED_USER_ERROR, NOT_FOUND_CODE, USER_ALREADY_VERIFIED } from 'src/constants/error-code';
import { EmailService } from 'src/email/email.service';
import getSignUpEmailTemplate from 'src/helpers/email/sign-up-template';
import { Prisma } from 'src/generated/prisma/client';
import { generateCode } from 'src/helpers/email/generate-code';

@Injectable()
export class VerificationCodeService {
    constructor(private readonly prismaService: PrismaService, private readonly emailService: EmailService) { }

    async verifyVerificationCode(body: VerifyCodeDto) {
        try {
            const foundUser = await this.prismaService.user.findUnique({ where: { email: body.email } })
            if (!foundUser) {
                throw new NotFoundException({ message: "User not found", code: NOT_EXISTED_USER_ERROR })
            }
            if (foundUser.confirmationAt != null) {
                throw new BadRequestException({ message: "User already verified", code: USER_ALREADY_VERIFIED })
            }

            const latestCode = await this.prismaService.verificationCode.findFirst({
                where: { userId: foundUser.id },
                orderBy: { createdAt: 'desc' },
            });

            if (!latestCode) {
                throw new BadRequestException({ message: "Not found code", code: NOT_FOUND_CODE });
            }

            if (latestCode.expiredAt < new Date()) {
                throw new BadRequestException({ message: "Code expired, please try another", code: EXPIRED_ACCESS_TOKEN });
            }

            if (latestCode.code !== body.code) {
                throw new BadRequestException({ message: "Incorrect code, please try again", code: INCORRECT_CODE });
            }

            await this.prismaService.$transaction(async (tx) => {
                await tx.verificationCode.update({ where: { id: latestCode.id }, data: { isVerified: true, isVerifiedAt: new Date() } })
                await tx.user.update({ where: { id: foundUser.id }, data: { confirmationAt: new Date() } })
            })
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException({ message: "Failed to verify the user account, please try again", code: INTERNAL_SERVER_ERROR })
        }
    }

    async generateVerificationCode(body: VerifyCodeDto) {
        try {
            const foundUser = await this.prismaService.user.findUnique({ where: { email: body.email } })
            if (!foundUser) {
                throw new NotFoundException({ message: "User not found", code: NOT_EXISTED_USER_ERROR })
            }
            if (foundUser.confirmationAt != null) {
                throw new BadRequestException({ message: "User already verified", code: USER_ALREADY_VERIFIED })
            }

            const code: Prisma.VerificationCodeUncheckedCreateInput = {
                code: generateCode(),
                userId: foundUser.id,
                expiredAt: new Date(Date.now() + 10 * 60 * 1000),
                isVerified: false,
            }

            await this.emailService.send(body.email, "MeeFins - Sign up verification code", getSignUpEmailTemplate(foundUser.displayName ?? "---", code.code))
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException({ message: "Failed to generate verification code, please try again", code: INTERNAL_SERVER_ERROR })
        }
    }
}