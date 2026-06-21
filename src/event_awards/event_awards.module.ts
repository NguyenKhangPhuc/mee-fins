import { Module } from '@nestjs/common';
import { EventAwardsController } from './event_awards.controller';
import { EventAwardsService } from './event_awards.service';

@Module({
  controllers: [EventAwardsController],
  providers: [EventAwardsService],
  exports: [EventAwardsService],
})
export class EventAwardsModule {}
