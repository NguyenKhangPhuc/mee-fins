import { Module } from '@nestjs/common';
import { GroupChallengesService } from './group_challenges.service';

@Module({
  providers: [GroupChallengesService],
  exports: [GroupChallengesService],
})
export class GroupChallengesModule {}
