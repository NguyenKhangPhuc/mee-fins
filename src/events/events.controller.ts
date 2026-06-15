import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EventsService } from './events.service';
import { EventQueryDto } from './dto/events-query.dto';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}
  @Get('')
  @UseGuards(JwtAuthGuard)
  async getAllEvents(@Query() query: EventQueryDto) {
    const events = await this.eventsService.getAllEvent(query);
    return events;
  }

  @Get('single-event')
  @UseGuards(JwtAuthGuard)
  async getSingleEvent(@Query() query: EventQueryDto) {
    const singleEvent = await this.eventsService.getSingleEvent(query);
    return singleEvent;
  }
}
