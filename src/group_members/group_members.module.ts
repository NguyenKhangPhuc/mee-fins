import { Module } from '@nestjs/common';
import { GroupMembersService } from './group_members.service';

@Module({
  providers: [GroupMembersService],
  exports: [GroupMembersService],
})
export class GroupMembersModule {}
