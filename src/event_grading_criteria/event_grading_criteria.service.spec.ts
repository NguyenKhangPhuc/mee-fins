import { Test, TestingModule } from '@nestjs/testing';
import { EventGradingCriteriaService } from './event_grading_criteria.service';

describe('EventGradingCriteriaService', () => {
  let service: EventGradingCriteriaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventGradingCriteriaService],
    }).compile();

    service = module.get<EventGradingCriteriaService>(EventGradingCriteriaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
