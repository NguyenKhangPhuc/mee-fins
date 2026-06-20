import { Test, TestingModule } from '@nestjs/testing';
import { EventChallengesController } from './event_challenges.controller';

describe('EventChallengesController', () => {
  let controller: EventChallengesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventChallengesController],
    }).compile();

    controller = module.get<EventChallengesController>(EventChallengesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
