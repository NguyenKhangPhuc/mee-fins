import { Module } from '@nestjs/common';
import { UserLanguagesService } from './user_languages.service';
import { UserLanguagesController } from './user_languages.controller';
import { ProfileModule } from 'src/profile/profile.module';

@Module({
  imports: [ProfileModule],
  providers: [UserLanguagesService],
  controllers: [UserLanguagesController],
  exports: [UserLanguagesService]
})
export class UserLanguagesModule { }
