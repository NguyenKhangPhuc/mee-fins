import { Test, TestingModule } from '@nestjs/testing';
import { EventChallengesService } from './event_challenges.service';

describe('EventChallengesService', () => {
  let service: EventChallengesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventChallengesService],
    }).compile();

    service = module.get<EventChallengesService>(EventChallengesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
