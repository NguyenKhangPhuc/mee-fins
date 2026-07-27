import { Body, Controller, Post, UseGuards, UseInterceptors, UploadedFile, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import * as safeUser from 'src/types/safe-user';
import { ProfileUpdationDto } from './dto/profile-updation.dto';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Post('update')
    @UseGuards(JwtAuthGuard)
    async updateProfile(@CurrentUser() user: safeUser.SafeUser, @Body() body: ProfileUpdationDto) {
        return await this.profileService.updateProfile(body);
    }

    @Get('')
    @UseGuards(JwtAuthGuard)
    async getUserProfile(@CurrentUser() user: safeUser.SafeUser) {
        return await this.profileService.getUserProfile(user.id)
    }

    @Post('update-image')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('poster'))
    async updateProfileImage(
        @CurrentUser() user: safeUser.SafeUser,
        @UploadedFile() file: Express.Multer.File,
        @Body() body: { oldPosterKey?: string }
    ) {
        return await this.profileService.updateProfilePoster({
            poster: file,
            userId: user.id,
            oldPosterKey: body?.oldPosterKey,
        });
    }


    @Get('languages-slots')
    @UseGuards(JwtAuthGuard)
    async getUserLanguagesAndSlots(@CurrentUser() user: safeUser.SafeUser) {
        return await this.profileService.getUserProfileWithLanguageAndSlots(user.id);
    }

    @Get('user-languages-slots')
    @UseGuards(JwtAuthGuard)
    async getUserLanguagesAndSlotsById(@CurrentUser() user: safeUser.SafeUser) {
        return await this.profileService.getUserProfileWithLanguageAndSlotsById(user.id);
    }
}
