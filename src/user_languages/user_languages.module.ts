import { Module } from '@nestjs/common';
import { UserLanguagesService } from './user_languages.service';
import { UserLanguagesController } from './user_languages.controller';

@Module({
  providers: [UserLanguagesService],
  controllers: [UserLanguagesController],
  exports: [UserLanguagesService]
})
export class UserLanguagesModule { }
