import { Test, TestingModule } from '@nestjs/testing';
import { EventAwardsController } from './event_awards.controller';

describe('EventAwardsController', () => {
  let controller: EventAwardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventAwardsController],
    }).compile();

    controller = module.get<EventAwardsController>(EventAwardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
