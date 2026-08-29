import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { ProfileService } from 'src/profile/profile.service';
import { ProfileModule } from 'src/profile/profile.module';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  imports: [ProfileModule],
  controllers: [UsersController],
})
export class UsersModule { }
