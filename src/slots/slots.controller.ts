import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SlotsService } from './slots.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SlotUserIdDto } from './dto/slot-user_id.dto';
import { SlotCreationDto } from './dto/slot-creation.dto';
import { SlotDeletionDto } from './dto/slot-deletion.dto';

@Controller('slots')
export class SlotsController {
    constructor(private readonly slotsService: SlotsService) { }
    @Get('user/:userId')
    @UseGuards(JwtAuthGuard)
    async getAllSlotsByUserId(@Param() params: SlotUserIdDto) {
        return this.slotsService.getAllSlotsByUserId(params.userId);
    }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    async createSlot(@Body() body: SlotCreationDto) {
        return this.slotsService.createSlot(body);
    }

    @Post('delete')
    @UseGuards(JwtAuthGuard)
    async deleteSlotById(@Body() body: SlotDeletionDto) {
        return this.slotsService.deleteSlotById(body);
    }
}
