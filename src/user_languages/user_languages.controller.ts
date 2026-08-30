import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserLanguagesService } from './user_languages.service';
import { UserLanguagesUserIdDto } from './dto/user_languages-user_id.dto';
import { UserLanguagesCreationDto } from './dto/user_languages-creation.dto';
import { UserLanguagesDeleteDto } from './dto/user_languages-delete.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import type { SafeUser } from 'src/types/safe-user';

@Controller('user-languages')
export class UserLanguagesController {
    constructor(private readonly userLanguagesService: UserLanguagesService) { }
    @Get('user/:userId')
    @UseGuards(JwtAuthGuard)
    async getAllUserLanguagesByUserId(@Param() params: UserLanguagesUserIdDto) {
        return this.userLanguagesService.getAllUserLanguagesByUserId(params);
    }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    async createUserLanguage(@Body() body: UserLanguagesCreationDto) {
        return this.userLanguagesService.createUserLanguage(body);
    }

    @Post('delete')
    @UseGuards(JwtAuthGuard)
    async deleteUserLanguage(@CurrentUser() user: SafeUser, @Body() body: UserLanguagesDeleteDto) {
        return this.userLanguagesService.deleteUserLanguage(user.id, body);
    }
}
