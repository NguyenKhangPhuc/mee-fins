import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LanguagesService } from './languages.service';
import { LanguageQueryDto } from './dto/language-query.dto';
import { LanguageCreationDto } from './dto/language-creation.dto';
import { LanguageDeleteDto } from './dto/language-delete.dto';

@Controller('languages')
export class LanguagesController {
    constructor(private readonly languagesService: LanguagesService) { }
    @Get('')
    @UseGuards(JwtAuthGuard)
    async getAllLanguages(@Query() query: LanguageQueryDto) {
        const languages = await this.languagesService.getAllLanguages(query);
        return languages;
    }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    async createLanguage(@Body() body: LanguageCreationDto) {
        const language = await this.languagesService.createLanguage(body);
        return language;
    }

    @Delete('delete')
    @UseGuards(JwtAuthGuard)
    async deleteLanguage(@Body() body: LanguageDeleteDto) {
        const language = await this.languagesService.deleteLanguage(body);
        return language;
    }
}
