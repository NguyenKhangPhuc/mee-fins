// meeting/meeting-timeout.processor.ts
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { SlotsService } from './slots.service';

@Processor('meeting-timeout')
export class SlotTimeoutProcessor extends WorkerHost {
    private readonly logger = new Logger(SlotTimeoutProcessor.name);

    constructor(private slotService: SlotsService) {
        super();
    }

    async process(job: Job<{ slotId: string }>) {
        const { slotId } = job.data;

        this.logger.log(`Timeout triggered for slot ${slotId}`);

        // roomName = slotId, dùng thẳng slotId để đóng room
        await this.slotService.forceEndMeeting(slotId);

        // Không update status ở đây — để webhook room_finished xử lý,
        // tránh update logic bị lặp ở 2 nơi
    }

    @OnWorkerEvent('failed')
    onFailed(job: Job, err: Error) {
        this.logger.error(`Job ${job.id} failed for slot ${job.data?.slotId}: ${err.message}`);
    }
}