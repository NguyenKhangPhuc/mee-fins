import { Module } from '@nestjs/common';
import { EventGradingCriteriaController } from './event_grading_criteria.controller';
import { EventGradingCriteriaService } from './event_grading_criteria.service';

@Module({
  controllers: [EventGradingCriteriaController],
  providers: [EventGradingCriteriaService],
  exports: [EventGradingCriteriaService],
})
export class EventGradingCriteriaModule {}
