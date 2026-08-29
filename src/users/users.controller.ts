import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAdminAuthGuard } from 'src/auth/guards/jwt-admin-auth.guard';
import { PaginationDto } from 'src/helpers/pagination/dto/pagination.dto';
import { UpdateUserRoleDto } from './dto/user-update-role.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('admin/all')
    @UseGuards(JwtAdminAuthGuard)
    async getAllUsers(@Query() query: PaginationDto) {
        return this.usersService.getAllUsers(query);
    }

    @Post('admin/update-role')
    @UseGuards(JwtAdminAuthGuard)
    async updateRoleByUserId(@Body() body: UpdateUserRoleDto) {
        return this.usersService.updateRoleByUserId(body);
    }
}
