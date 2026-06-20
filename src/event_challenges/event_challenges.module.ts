import { Module } from '@nestjs/common';
import { EventChallengesService } from './event_challenges.service';
import { EventChallengesController } from './event_challenges.controller';

@Module({
  providers: [EventChallengesService],
  controllers: [EventChallengesController],
  exports: [EventChallengesService],
})
export class EventChallengesModule {}
