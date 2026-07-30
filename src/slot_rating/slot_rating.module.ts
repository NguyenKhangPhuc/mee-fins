import { Module } from '@nestjs/common';
import { SlotRatingService } from './slot_rating.service';
import { SlotRatingController } from './slot_rating.controller';

@Module({
  providers: [SlotRatingService],
  controllers: [SlotRatingController]
})
export class SlotRatingModule {}
