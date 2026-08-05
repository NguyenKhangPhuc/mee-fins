import { Module } from '@nestjs/common';
import { SlotsService } from './slots.service';
import { SlotsController } from './slots.controller';
import { BullModule } from '@nestjs/bullmq';
import { SlotTimeoutProcessor } from './slot-timeout.processor';
import { EmailModule } from 'src/email/email.module';
import { UserLanguagesModule } from 'src/user_languages/user_languages.module';

@Module({
  providers: [SlotsService, SlotTimeoutProcessor],
  controllers: [SlotsController],
  exports: [SlotsService],
  imports: [
    EmailModule,
    BullModule.registerQueue({
      name: 'meeting-timeout', // tên queue, dùng để inject ở nơi khác
    }),
    UserLanguagesModule,
  ]

})
export class SlotsModule { }

