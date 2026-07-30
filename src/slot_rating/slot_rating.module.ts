import { Module } from '@nestjs/common';
import { SlotRatingService } from './slot_rating.service';
import { SlotRatingController } from './slot_rating.controller';
import { SlotsModule } from 'src/slots/slots.module';

@Module({
  providers: [SlotRatingService],
  controllers: [SlotRatingController],
  imports: [SlotsModule]
})
export class SlotRatingModule { }
