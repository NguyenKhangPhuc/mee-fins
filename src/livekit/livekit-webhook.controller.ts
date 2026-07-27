// nestjs: src/livekit/livekit-webhook.controller.ts
import { Controller, Post, Req, Headers } from '@nestjs/common';
import { WebhookReceiver } from 'livekit-server-sdk';
import type { Request } from 'express';
import { livekitApiKey, livekitApiSecret } from 'src/utils/config';
import { SlotsService } from 'src/slots/slots.service';
import { SlotStatus } from 'src/generated/prisma/enums';

@Controller('webhooks/livekit')
export class LivekitWebhookController {
    private receiver: WebhookReceiver;

    constructor(private slotsService: SlotsService) {
        this.receiver = new WebhookReceiver(
            livekitApiKey,
            livekitApiSecret,
        );
    }

    @Post()
    async handleWebhook(@Req() req: Request, @Headers('authorization') authHeader: string) {
        // req.body phải là raw string, xem lưu ý bên dưới
        console.log("WEBHOOK HIT !!!")
        const event = await this.receiver.receive(req.body, authHeader);
        const roomName = event.room?.name;
        console.log("This is the event in webhooks", event)
        if (!roomName) {
            // Log lại để biết khi nào xảy ra case này, nhưng không throw lỗi
            console.warn(`room_finished event lack room.name, event: ${JSON.stringify(event)}`);
            return { ok: true }; // vẫn trả 200, tránh LiveKit retry
        }
        switch (event.event) {
            case 'participant_joined': {
                const roomName = event.room?.name;
                const identity = event.participant?.identity;

                if (!roomName) {
                    console.warn(`participant_joined event lack room.name`);
                    return { ok: true };
                }

                console.log(`Participant ${identity} joined room ${roomName}`);
                break;
            }
            case 'room_finished':
                await this.slotsService.updateSlotStatus(roomName, SlotStatus.COMPLETED);
                break;
        }

        return { ok: true };
    }
}