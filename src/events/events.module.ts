import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { FileModule } from 'src/file/file.module';
import { EventChallengesModule } from 'src/event_challenges/event_challenges.module';
import { EventGradingCriteriaModule } from 'src/event_grading_criteria/event_grading_criteria.module';

@Module({
  controllers: [EventsController],
  providers: [EventsService],
  imports: [FileModule, EventChallengesModule, EventGradingCriteriaModule],
  exports: [EventsService],
})
export class EventsModule {}
