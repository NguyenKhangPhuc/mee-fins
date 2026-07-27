import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { livekitApiKey, livekitApiSecret, livekitUrl } from 'src/utils/config';
import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';
import { SlotsService } from 'src/slots/slots.service';
import { SLOT_NOT_PARTICIPATED_ERROR } from 'src/constants/error-code';
import { TokenCreationDto } from './dto/token-creation.dto';
@Injectable()
export class LivekitService {
    constructor(private readonly slotService: SlotsService) { }
    private readonly apiKey = livekitApiKey;
    private readonly apiSecret = livekitApiSecret;
    private readonly livekitUrl = livekitUrl;

    async generateToken(body: TokenCreationDto, userId: string): Promise<string> {
        const slot = await this.slotService.isSlotParticipatedByUser(body.slotId, userId);
        if (!slot) {
            throw new UnauthorizedException({
                message: 'You are not authorized to access this slot',
                code: SLOT_NOT_PARTICIPATED_ERROR,
            });
        }
        const now = new Date();
        const startTime = new Date(slot.startTime);
        const endTime = new Date(slot.endTime);
        const allowedStartTime = new Date(startTime.getTime() - 5 * 60 * 1000);

        if (now < allowedStartTime) {
            throw new ForbiddenException('The meeting has not started yet, please wait');
        }

        if (now > endTime) {
            throw new BadRequestException('The meeting has ended');
        }
        const at = new AccessToken(this.apiKey, this.apiSecret, {
            identity: userId,
        });
        at.addGrant({
            roomJoin: true,
            room: body.roomId,
            canPublish: true,
            canSubscribe: true,
            canPublishData: true,
        });
        return await at.toJwt();
    }
    async closeRoom(roomId: string) {
        const roomService = new RoomServiceClient(this.livekitUrl, this.apiKey, this.apiSecret);
        await roomService.deleteRoom(roomId);
    }
}