import { Test, TestingModule } from '@nestjs/testing';
import { SlotRatingController } from './slot_rating.controller';

describe('SlotRatingController', () => {
  let controller: SlotRatingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SlotRatingController],
    }).compile();

    controller = module.get<SlotRatingController>(SlotRatingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
