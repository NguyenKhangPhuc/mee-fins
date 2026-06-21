import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { GroupMembersModule } from 'src/group_members/group_members.module';
import { GroupChallengesModule } from 'src/group_challenges/group_challenges.module';
import { InvitationsModule } from 'src/invitations/invitations.module';
import { FileModule } from 'src/file/file.module';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService],
  imports: [
    GroupMembersModule,
    GroupChallengesModule,
    InvitationsModule,
    FileModule,
  ],
})
export class GroupsModule {}
