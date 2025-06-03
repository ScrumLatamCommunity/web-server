import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('events')
  findAllEvents() {
    return this.eventsService.findAllEvents();
  }

  @Get('activities')
  findAllActivities() {
    return this.eventsService.findAllActivities();
  }

  @Get('events/:id')
  findOneEvent(@Param('id') id: string) {
    return this.eventsService.findOneEvent(id);
  }

  @Get('activities/:id')
  findOneActivity(@Param('id') id: string) {
    return this.eventsService.findOneActivity(id);
  }

  @Post('events')
  createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.createEvent(createEventDto);
  }

  @Post('activities')
  createActivity(@Body() createActivityDto: CreateActivityDto) {
    return this.eventsService.createActivity(createActivityDto);
  }

  @Patch('events/:id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.updateEvent(id, updateEventDto);
  }

  @Patch('activities/:id')
  updateActivity(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    return this.eventsService.updateActivity(id, updateActivityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.disableEvent(id);
  }

  @Delete('activities/:id')
  removeActivity(@Param('id') id: string) {
    return this.eventsService.disableActivity(id);
  }
}
