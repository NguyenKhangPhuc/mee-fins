import { Module } from '@nestjs/common';
import { LivekitService } from './livekit.service';
import { LivekitController } from './livekit.controller';
import { SlotsModule } from 'src/slots/slots.module';
import { LivekitWebhookController } from './livekit-webhook.controller';
import { ProfileModule } from 'src/profile/profile.module';

@Module({
  providers: [LivekitService],
  controllers: [LivekitController, LivekitWebhookController],
  imports: [SlotsModule, ProfileModule]
})

export class LivekitModule { }