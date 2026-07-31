import { Body, Controller, Get, Param, Post, Query, UnauthorizedException, UseGuards } from '@nestjs/common';
import { SlotsService } from './slots.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SlotUserIdDto } from './dto/slot-user_id.dto';
import { SlotCreationDto } from './dto/slot-creation.dto';
import { SlotDeletionDto } from './dto/slot-deletion.dto';
import { SlotExchangeUpdationDto } from './dto/slot-exchange-updation.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import type { SafeUser } from 'src/types/safe-user';
import { SLOT_NOT_PARTICIPATED_ERROR } from 'src/constants/error-code';
import { SingleSlotDto } from './dto/slot-get-single';
import { PaginationDto } from 'src/helpers/pagination/dto/pagination.dto';
import { SlotPaginationDto } from './dto/slot-pagination.dto';
import { SlotStatus } from 'src/generated/prisma/enums';

@Controller('slots')
export class SlotsController {
    constructor(private readonly slotsService: SlotsService) { }
    @Get('user')
    @UseGuards(JwtAuthGuard)
    async getAllSlotsByUserId(@CurrentUser() user: SafeUser, @Query() query: SlotPaginationDto) {
        return this.slotsService.getAllSlotsByUserId(user.id, query);
    }

    @Get('current')
    @UseGuards(JwtAuthGuard)
    async getCurrentDBTime() {
        const dbNow = await this.slotsService.getDbNow();
        return { serverNow: dbNow.getTime() }
    }


    @Get(':slotId')
    @UseGuards(JwtAuthGuard)
    async getSlotBySlotId(@CurrentUser() user: SafeUser, @Param() params: SingleSlotDto) {
        return this.slotsService.getSingleSlotBySlotAndUserId(params.slotId, user.id);
    }


    @Post('create')
    @UseGuards(JwtAuthGuard)
    async createSlot(@Body() body: SlotCreationDto) {
        return this.slotsService.createSlot(body);
    }

    @Post('delete')
    @UseGuards(JwtAuthGuard)
    async deleteSlotById(@CurrentUser() user: SafeUser, @Body() body: SlotDeletionDto) {
        return this.slotsService.deleteSlotById(body, user.id);
    }

    @Post('end-meeting')
    @UseGuards(JwtAuthGuard)
    async forceEndMeeting(@CurrentUser() user: SafeUser, @Body() body: SlotDeletionDto) {
        const slot = await this.slotsService.isSlotParticipatedByUser(body.id, user.id, SlotStatus.BOOKED)
        if (!slot) {
            throw new UnauthorizedException({
                message: 'You are not authorized to access this slot',
                code: SLOT_NOT_PARTICIPATED_ERROR,
            });
        }
        return this.slotsService.forceEndMeeting(body.id);
    }

    @Post('book')
    @UseGuards(JwtAuthGuard)
    async bookUserSlot(@Body() body: SlotExchangeUpdationDto) {
        return this.slotsService.updateSlotExchangeUser(body);
    }
}
