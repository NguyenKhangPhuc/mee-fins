import { Body, Controller, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { LivekitService } from './livekit.service';
import { TokenCreationDto } from './dto/token-creation.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import type { SafeUser } from 'src/types/safe-user';
import { SlotsService } from 'src/slots/slots.service';
import { SLOT_NOT_PARTICIPATED_ERROR } from 'src/constants/error-code';
import { SlotStatus } from 'src/generated/prisma/browser';
import { RoomCloseDto } from './dto/room-close.dto';

@Controller('livekit')
export class LivekitController {
    constructor(
        private readonly liveKitService: LivekitService,
        private readonly slotService: SlotsService
    ) { }
    @Post('generate-token')
    @UseGuards(JwtAuthGuard)
    async getToken(@Body() body: TokenCreationDto, @CurrentUser() user: SafeUser) {
        const isAuthorized = await this.slotService.isSlotParticipatedByUser(body.slotId, user.id);
        if (!isAuthorized) {
            throw new UnauthorizedException({
                message: 'You are not authorized to access this slot',
                code: SLOT_NOT_PARTICIPATED_ERROR,
            });
        }

        const token = await this.liveKitService.generateToken(body.roomId, body.userId);
        return { token };
    }

    @Post('close-room')
    @UseGuards(JwtAuthGuard)
    async closeRoom(@Body() body: RoomCloseDto) {
        await this.slotService.updateSlotStatus(body.slotId, SlotStatus.COMPLETED);
        await this.liveKitService.closeRoom(body.roomId);
        return { message: 'Room closed successfully' };
    }
}
