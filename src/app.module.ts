import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './exceptions/all-exception.filter';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';
import { ZodExceptionFilter } from './exceptions/zod-exception.filter';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { EventsService } from './events/events.service';
import { EventsModule } from './events/events.module';
import { GroupsModule } from './groups/groups.module';
import { QueryService } from './query/query.service';
import { QueryModule } from './query/query.module';
import { GroupMembersController } from './group_members/group_members.controller';
import { GroupMembersModule } from './group_members/group_members.module';
import { GroupChallengesModule } from './group_challenges/group_challenges.module';
import { InvitationsModule } from './invitations/invitations.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [AuthModule, UsersModule, PrismaModule, EventsModule, GroupsModule, QueryModule, GroupMembersModule, GroupChallengesModule, InvitationsModule, FileModule],
  controllers: [AppController, GroupMembersController],
  providers: [
    AppService,
    PrismaService,
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_FILTER, useClass: ZodExceptionFilter },
    EventsService,
    QueryService,
  ],
})
export class AppModule {}
