import { Module } from '@nestjs/common';
import { LivekitService } from './livekit.service';
import { LivekitController } from './livekit.controller';
import { SlotsModule } from 'src/slots/slots.module';

@Module({
  providers: [LivekitService],
  controllers: [LivekitController],
  imports: [SlotsModule]
})
export class LivekitModule { }
