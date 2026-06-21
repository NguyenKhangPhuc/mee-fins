import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { ProfileService } from 'src/profile/profile.service';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  imports: [ProfileService],
})
export class UsersModule {}
