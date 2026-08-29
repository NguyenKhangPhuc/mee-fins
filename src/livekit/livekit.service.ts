import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { livekitApiKey, livekitApiSecret, livekitUrl } from 'src/utils/config';
import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';
import { SlotsService } from 'src/slots/slots.service';
import { SLOT_ALREADY_ENDED, SLOT_NOT_PARTICIPATED_ERROR, SLOT_NOT_STARTED } from 'src/constants/error-code';
import { TokenCreationDto } from './dto/token-creation.dto';
import { ConfigService } from '@nestjs/config';
import { SlotStatus } from 'src/generated/prisma/enums';
import { ProfileService } from 'src/profile/profile.service';
@Injectable()
export class LivekitService {
    private roomService: RoomServiceClient;
    private readonly apiKey = livekitApiKey;
    private readonly apiSecret = livekitApiSecret;
    private readonly url = livekitUrl;
    constructor(private readonly slotService: SlotsService,
        private readonly profileService: ProfileService
    ) {
        this.roomService = new RoomServiceClient(
            this.url,
            this.apiKey,
            this.apiSecret,
        );
    }


    async generateToken(body: TokenCreationDto, userId: string): Promise<string> {
        const slot = await this.slotService.isSlotParticipatedByUser(body.slotId, userId, SlotStatus.BOOKED);
        if (!slot) {
            throw new UnauthorizedException({
                message: 'You are not authorized to access this slot',
                code: SLOT_NOT_PARTICIPATED_ERROR,
            });
        }
        const user = await this.profileService.getUserProfile(userId)
        const now = new Date();
        const startTime = new Date(slot.startTime);
        const endTime = new Date(slot.endTime);
        const allowedStartTime = new Date(startTime.getTime() - 5 * 60 * 1000);

        if (now < allowedStartTime) {
            throw new ForbiddenException({ message: "The meeting has not started yet, please wait", code: SLOT_NOT_STARTED });
        }

        if (now > endTime) {
            throw new BadRequestException({ message: 'The meeting has ended', code: SLOT_ALREADY_ENDED });
        }
        const at = new AccessToken(this.apiKey, this.apiSecret, {
            identity: user?.fullName ?? "Username",
            ttl: 7200,
        });
        at.addGrant({
            roomJoin: true,
            room: slot.id,
            canPublish: true,
            canSubscribe: true,
            canPublishData: true,
        });
        return await at.toJwt();
    }
    async closeRoom(slotId: string) {
        await this.roomService.deleteRoom(slotId);
    }
}