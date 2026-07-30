import { Controller } from '@nestjs/common';
import { SlotRatingService } from './slot_rating.service';
import { SlotsService } from 'src/slots/slots.service';

@Controller('slot-rating')
export class SlotRatingController {
    constructor(private readonly ratingService: SlotRatingService, private readonly slotService: SlotsService) { }


}
