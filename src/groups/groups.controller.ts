import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GroupsService } from './groups.service';
import { GroupQueryDto } from './dto/groups-query.dto';
import { GroupUpdationDto } from './dto/group-updations.dto';
import { GroupCreationDto } from './dto/group.dto';

@Controller('groups')
export class GroupsController {
  constructor(private groupsService: GroupsService) {}
  @Get('')
  @UseGuards(JwtAuthGuard)
  async getAll(@Query() query: GroupQueryDto) {
    const result = await this.groupsService.getGroups(query);
    return result;
  }

  @Get('single-group')
  @UseGuards(JwtAuthGuard)
  async getSingleGroup(@Query() query: GroupQueryDto) {
    const result = await this.groupsService.getSingleGroup(query);
    return result;
  }

  @Put('single-group')
  @UseGuards(JwtAuthGuard)
  async updateGroup(
    @Query() query: GroupQueryDto,
    @Body() body: GroupUpdationDto,
  ) {
    const result = await this.groupsService.updateSingleGroup({ query, body });
    return result;
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  async createGroup(@Body() body: GroupCreationDto) {
    await this.groupsService.createGroupMemberAndChallengeTransaction(body);
    return { success: true };
  }
}
