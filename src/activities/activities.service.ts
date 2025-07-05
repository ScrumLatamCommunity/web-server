import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterStatusDto } from './dto/filter-status.dto';
import { RegisterActivityDto } from './dto/register-activity.dto';

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

    const filteredActivities = this.checkInactives(activities);
    return filteredActivities;
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
      include: {
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            username: true,
            profilePictureUrl: true,
          },
        },
      },
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
      data: { status: 'REJECTED' },
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

  async registerUserToActivity(
    activityId: string,
    registerActivityDto: RegisterActivityDto,
  ) {
    const { userId } = registerActivityDto;

    // Verificar que la actividad existe
    const activity = await this.prisma.activity.findUnique({
      where: { id: activityId },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    // Verificar que el usuario existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verificar que la actividad esté activa
    if (activity.status !== 'ACTIVE') {
      throw new ConflictException('Activity is not active for registration');
    }

    // Verificar que el usuario no esté ya registrado
    const existingRegistration = await this.prisma.activity.findFirst({
      where: {
        id: activityId,
        users: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (existingRegistration) {
      throw new ConflictException(
        'User is already registered for this activity',
      );
    }

    // Registrar al usuario en la actividad
    const updatedActivity = await this.prisma.activity.update({
      where: { id: activityId },
      data: {
        users: {
          connect: { id: userId },
        },
      },
      include: {
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            username: true,
          },
        },
      },
    });

    return {
      message: 'User successfully registered for activity',
      activity: updatedActivity,
    };
  }

  async unregisterUserFromActivity(
    activityId: string,
    registerActivityDto: RegisterActivityDto,
  ) {
    const { userId } = registerActivityDto;

    // Verificar que la actividad existe
    const activity = await this.prisma.activity.findUnique({
      where: { id: activityId },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    // Verificar que el usuario existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verificar que el usuario esté registrado
    const existingRegistration = await this.prisma.activity.findFirst({
      where: {
        id: activityId,
        users: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (!existingRegistration) {
      throw new ConflictException('User is not registered for this activity');
    }

    // Desregistrar al usuario de la actividad
    const updatedActivity = await this.prisma.activity.update({
      where: { id: activityId },
      data: {
        users: {
          disconnect: { id: userId },
        },
      },
      include: {
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            username: true,
          },
        },
      },
    });

    return {
      message: 'User successfully unregistered from activity',
      activity: updatedActivity,
    };
  }

  async getActivitiesByUser(userId: string) {
    // Verificar que el usuario existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Obtener todas las actividades del usuario
    const userWithActivities = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        activities: true,
      },
    });

    return userWithActivities.activities;
  }

  async getUsersByActivity(activityId: string) {
    // Verificar que la actividad existe
    const activity = await this.prisma.activity.findUnique({
      where: { id: activityId },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    // Obtener todos los usuarios de la actividad
    const activityWithUsers = await this.prisma.activity.findUnique({
      where: { id: activityId },
      include: {
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            username: true,
            profilePictureUrl: true,
          },
        },
      },
    });

    return activityWithUsers.users;
  }
}
