import { Module } from '@nestjs/common';
import { SlotsService } from './slots.service';
import { SlotsController } from './slots.controller';
import { BullModule } from '@nestjs/bullmq';
import { SlotTimeoutProcessor } from './slot-timeout.processor';

@Module({
  providers: [SlotsService, SlotTimeoutProcessor],
  controllers: [SlotsController],
  exports: [SlotsService],
  imports: [
    BullModule.registerQueue({
      name: 'meeting-timeout', // tên queue, dùng để inject ở nơi khác
    }),
  ]

})
export class SlotsModule { }
