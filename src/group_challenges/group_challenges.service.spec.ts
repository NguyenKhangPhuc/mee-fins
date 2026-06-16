import { Test, TestingModule } from '@nestjs/testing';
import { GroupChallengesService } from './group_challenges.service';

describe('GroupChallengesService', () => {
  let service: GroupChallengesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupChallengesService],
    }).compile();

    service = module.get<GroupChallengesService>(GroupChallengesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
