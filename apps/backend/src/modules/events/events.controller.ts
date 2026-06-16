import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EventsService } from './events.service';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('current')
  @ApiOperation({ summary: 'Get current active event' })
  getCurrent() {
    return this.eventsService.getCurrentEvent();
  }
}
