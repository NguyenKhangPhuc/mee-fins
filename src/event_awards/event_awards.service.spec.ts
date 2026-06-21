import { Test, TestingModule } from '@nestjs/testing';
import { EventAwardsService } from './event_awards.service';

describe('EventAwardsService', () => {
  let service: EventAwardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventAwardsService],
    }).compile();

    service = module.get<EventAwardsService>(EventAwardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
