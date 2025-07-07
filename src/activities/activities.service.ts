import { Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterStatusDto } from './dto/filter-status.dto';

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {
    this.prisma.$connect();
  }

  async checkInactives(activities) {
    const today = new Date();

    const expiredActivities = activities.filter(
      (activity) =>
        new Date(activity.date) < today && activity.status === 'ACTIVE',
    );

    if (expiredActivities.length > 0) {
      await this.prisma.activity.updateMany({
        where: {
          id: {
            in: expiredActivities.map((activity) => activity.id),
          },
        },
        data: { status: 'INACTIVE' },
      });

      return activities.map((activity) => {
        if (expiredActivities.some((expired) => expired.id === activity.id)) {
          return { ...activity, status: 'INACTIVE' };
        }
        return activity;
      });
    }

    return activities;
  }

  async findActivities(filterStatusDto?: FilterStatusDto) {
    const activity: any = {};

    if (filterStatusDto?.status) {
      activity.status = filterStatusDto.status;
    }

    const activities = await this.prisma.activity.findMany({
      where: activity,
    });

    await this.checkInactives(activities);

    const activeActivities = await this.prisma.activity.findMany({
      where: { status: 'ACTIVE' },
    });

    return activeActivities;
  }

  async findAllActivities(filterStatusDto?: FilterStatusDto) {
    const activity: any = {};

    if (filterStatusDto?.status) {
      activity.status = filterStatusDto.status;
    }

    const activities = await this.prisma.activity.findMany({
      where: activity,
    });

    return activities;
  }

  async findOneActivity(id: string) {
    const activity = await this.prisma.activity.findUnique({
      where: { id },
    });
    return activity;
  }

  async createActivity(createActivityDto: CreateActivityDto) {
    const activity = await this.prisma.activity.create({
      data: {
        ...createActivityDto,
        status: 'DRAFT',
      },
    });
    return activity;
  }

  async updateActivity(id: string, updateActivityDto: UpdateActivityDto) {
    const activity = await this.prisma.activity.update({
      where: { id },
      data: updateActivityDto,
    });
    return activity;
  }

  async switchActivityStatus(id: string) {
    const foundActivity = await this.prisma.activity.findUnique({
      where: { id },
    });
    if (foundActivity.status == 'ACTIVE') {
      const activity = await this.prisma.activity.update({
        where: { id },
        data: { status: 'INACTIVE' },
      });
      return activity;
    }
    if (foundActivity.status == 'INACTIVE') {
      const activity = await this.prisma.activity.update({
        where: { id },
        data: { status: 'ACTIVE' },
      });
      return activity;
    }
    return;
  }

  async rejectActivity(id: string) {
    const activity = await this.prisma.activity.update({
      where: { id },
      data: { status: 'INACTIVE' },
    });
    return activity;
  }

  async approveActivity(id: string) {
    const activity = await this.prisma.activity.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });
    return activity;
  }

  async revisionActivity(id: string) {
    const activity = await this.prisma.activity.update({
      where: { id },
      data: { status: 'REVISION' },
    });
    return activity;
  }
}
