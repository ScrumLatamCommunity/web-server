import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {
    this.prisma.$connect();
  }

  async checkInactives(events) {
    const today = new Date();

    const expiredEvents = events.filter(
      (event) => new Date(event.date) < today && event.status === 'ACTIVE',
    );

    if (expiredEvents.length > 0) {
      await this.prisma.event.updateMany({
        data: { status: 'INACTIVE' },
      });

      return await this.prisma.event.findMany();
    }
    return;
  }

  async findAllEvents() {
    const events = await this.prisma.event.findMany({
      where: {
        status: 'ACTIVE',
        type: 'EVENT',
      },
    });

    const filteredEvents = this.checkInactives(events);
    return filteredEvents;
  }

  async findAllActivities() {
    const activities = await this.prisma.event.findMany({
      where: {
        status: 'ACTIVE',
        type: 'ACTIVITY',
      },
    });
    const filteredActivities = this.checkInactives(activities);
    return filteredActivities;
  }

  async findOneEvent(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id, type: 'EVENT' },
    });
    return event;
  }

  async findOneActivity(id: string) {
    const activity = await this.prisma.event.findUnique({
      where: { id, type: 'ACTIVITY' },
    });
    return activity;
  }

  async createEvent(createEventDto: CreateEventDto) {
    const event = await this.prisma.event.create({ data: createEventDto });
    return event;
  }

  async createActivity(createActivityDto: CreateActivityDto) {
    const activity = await this.prisma.event.create({
      data: createActivityDto,
    });
    return activity;
  }

  async updateEvent(id: string, updateEventDto: UpdateEventDto) {
    const event = await this.prisma.event.update({
      where: { id, type: 'EVENT' },
      data: updateEventDto,
    });
    return event;
  }

  async updateActivity(id: string, updateActivityDto: UpdateActivityDto) {
    const activity = await this.prisma.event.update({
      where: { id, type: 'ACTIVITY' },
      data: updateActivityDto,
    });
    return activity;
  }

  async disableEvent(id: string) {
    const event = await this.prisma.event.update({
      where: { id, type: 'EVENT' },
      data: { status: 'INACTIVE' },
    });
    return event;
  }

  async disableActivity(id: string) {
    const activity = await this.prisma.event.update({
      where: { id, type: 'ACTIVITY' },
      data: { status: 'INACTIVE' },
    });
    return activity;
  }
}
