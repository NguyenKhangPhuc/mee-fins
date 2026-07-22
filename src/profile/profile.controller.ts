import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import * as safeUser from 'src/types/safe-user';
import { ProfileUpdationDto } from './dto/profile-updation.dto';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ProfileImageUpdationDto } from './dto/profile-image-updation.dto';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }
    @Post('update')
    @UseGuards(JwtAuthGuard)
    async updateProfile(@CurrentUser() user: safeUser.SafeUser, @Body() body: ProfileUpdationDto) {
        return await this.profileService.updateProfile(body);
    }

    @Post('update-image')
    @UseGuards(JwtAuthGuard)
    async updateProfileImage(@CurrentUser() user: safeUser.SafeUser, @Body() body: ProfileImageUpdationDto) {
        return await this.profileService.updateProfilePoster({
            poster: body.poster,
            userId: user.id,
            oldPosterKey: body.oldPosterKey,
        });
    }
}
