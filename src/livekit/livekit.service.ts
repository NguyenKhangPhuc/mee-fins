import { Injectable } from '@nestjs/common';
import { livekitApiKey, livekitApiSecret, livekitUrl } from 'src/utils/config';
import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';
@Injectable()
export class LivekitService {
    constructor() { }
    private readonly apiKey = livekitApiKey;
    private readonly apiSecret = livekitApiSecret;
    private readonly livekitUrl = livekitUrl;

    async generateToken(roomId: string, userId: string): Promise<string> {
        const at = new AccessToken(this.apiKey, this.apiSecret, {
            identity: userId,
        });
        at.addGrant({
            roomJoin: true,
            room: roomId,
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