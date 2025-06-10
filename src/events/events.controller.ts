import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FilterStatusDto } from './dto/filter-status.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('')
  findAllEvents(@Query() filterStatusDto: FilterStatusDto) {
    return this.eventsService.findAllEvents(filterStatusDto);
  }

  @Get('activities')
  findAllActivities(@Query() filterStatusDto: FilterStatusDto) {
    return this.eventsService.findAllActivities(filterStatusDto);
  }

  @Get('/:id')
  findOneEvent(@Param('id') id: string) {
    return this.eventsService.findOneEvent(id);
  }

  @Get('activities/:id')
  findOneActivity(@Param('id') id: string) {
    return this.eventsService.findOneActivity(id);
  }

  @Post('')
  createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.createEvent(createEventDto);
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.updateEvent(id, updateEventDto);
  }

  @Patch('switchStatus/:id')
  switchStatus(@Param('id') id: string) {
    return this.eventsService.switchEventStatus(id);
  }

  @Patch('reject/:id')
  rejectEvent(@Param('id') id: string) {
    return this.eventsService.rejectEvent(id);
  }

  @Patch('approve/:id')
  approveEvent(@Param('id') id: string) {
    return this.eventsService.approveEvent(id);
  }

  @Patch('revision/:id')
  revisionEvent(@Param('id') id: string) {
    return this.eventsService.revisionEvent(id);
  }
}
