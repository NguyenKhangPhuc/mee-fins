import { Body, Controller, Get, Param, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
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

@Controller('slots')
export class SlotsController {
    constructor(private readonly slotsService: SlotsService) { }
    @Get('user/:userId')
    @UseGuards(JwtAuthGuard)
    async getAllSlotsByUserId(@Param() params: SlotUserIdDto) {
        return this.slotsService.getAllSlotsByUserId(params.userId);
    }

    @Get(':slotId')
    @UseGuards(JwtAuthGuard)
    async getSlotBySlotId(@CurrentUser() user: SafeUser, @Param() params: SingleSlotDto) {
        return this.slotsService.isSlotParticipatedByUser(params.slotId, user.id);
    }

    @Get('current')
    @UseGuards(JwtAuthGuard)
    async getCurrentDBTime() {
        const dbNow = await this.slotsService.getDbNow();
        return { serverNow: dbNow.getTime() }
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
        const slot = await this.slotsService.isSlotParticipatedByUser(body.id, user.id)
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
