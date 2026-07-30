import { Test, TestingModule } from '@nestjs/testing';
import { SlotRatingService } from './slot_rating.service';

describe('SlotRatingService', () => {
  let service: SlotRatingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SlotRatingService],
    }).compile();

    service = module.get<SlotRatingService>(SlotRatingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
