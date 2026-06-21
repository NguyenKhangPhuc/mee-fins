import { Module } from '@nestjs/common';
import { GroupChallengesService } from './group_challenges.service';
import { GroupChallengesController } from './group_challenges.controller';

@Module({
  providers: [GroupChallengesService],
  exports: [GroupChallengesService],
  controllers: [GroupChallengesController],
})
export class GroupChallengesModule {}
