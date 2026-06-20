import { Test, TestingModule } from '@nestjs/testing';
import { EventGradingCriteriaController } from './event_grading_criteria.controller';

describe('EventGradingCriteriaController', () => {
  let controller: EventGradingCriteriaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventGradingCriteriaController],
    }).compile();

    controller = module.get<EventGradingCriteriaController>(EventGradingCriteriaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
