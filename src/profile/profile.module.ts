import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { FileModule } from 'src/file/file.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
  imports: [FileModule, AuthModule],
})
export class ProfileModule { }
