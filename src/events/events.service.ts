import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterStatusDto } from './dto/filter-status.dto';

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
        where: {
          id: {
            in: expiredEvents.map((event) => event.id),
          },
        },
        data: { status: 'INACTIVE' },
      });

      return events.map((event) => {
        if (expiredEvents.some((expired) => expired.id === event.id)) {
          return { ...event, status: 'INACTIVE' };
        }
        return event;
      });
    }

    return events;
  }

  async findAllEvents(filterStatusDto?: FilterStatusDto) {
    const event: any = {
      type: 'EVENT',
    };

    if (filterStatusDto?.status) {
      event.status = filterStatusDto.status;
    }

    const events = await this.prisma.event.findMany({
      where: event,
    });

    const filteredEvents = this.checkInactives(events);
    return filteredEvents;
  }

  async findAllActivities(filterStatusDto?: FilterStatusDto) {
    const activity: any = {
      type: 'ACTIVITY',
    };

    if (filterStatusDto?.status) {
      activity.status = filterStatusDto.status;
    }

    const activities = await this.prisma.event.findMany({
      where: activity,
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
    const event = await this.prisma.event.create({
      data: {
        ...createEventDto,
        status: 'DRAFT',
      },
    });
    return event;
  }

  async updateEvent(id: string, updateEventDto: UpdateEventDto) {
    const event = await this.prisma.event.update({
      where: { id },
      data: updateEventDto,
    });
    return event;
  }

  async switchEventStatus(id: string) {
    const foundEvent = await this.prisma.event.findUnique({
      where: { id },
    });
    if (foundEvent.status == 'ACTIVE') {
      const event = await this.prisma.event.update({
        where: { id },
        data: { status: 'INACTIVE' },
      });
      return event;
    }
    if (foundEvent.status == 'INACTIVE') {
      const event = await this.prisma.event.update({
        where: { id },
        data: { status: 'ACTIVE' },
      });
      return event;
    }
    return;
  }

  async rejectEvent(id: string) {
    const event = await this.prisma.event.update({
      where: { id },
      data: { status: 'REJECTED' },
    });
    return event;
  }

  async approveEvent(id: string) {
    const event = await this.prisma.event.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });
    return event;
  }

  async revisionEvent(id: string) {
    const event = await this.prisma.event.update({
      where: { id },
      data: { status: 'REVISION' },
    });
    return event;
  }
}
