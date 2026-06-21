import { Test, TestingModule } from '@nestjs/testing';
import { GroupChallengesController } from './group_challenges.controller';

describe('GroupChallengesController', () => {
  let controller: GroupChallengesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupChallengesController],
    }).compile();

    controller = module.get<GroupChallengesController>(GroupChallengesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
