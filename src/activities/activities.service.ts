import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterStatusDto } from './dto/filter-status.dto';
import { FilterActivitiesDto } from './dto/filter-activities.dto';
import { RegisterActivityDto } from './dto/register-activity.dto';
import { MailerService } from 'src/mailer/mailer.service';
import { envs } from 'src/config/envs';

@Injectable()
export class ActivitiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {
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

  async findAllActivities(filterActivitiesDto?: FilterActivitiesDto) {
    const where: any = {};

    if (filterActivitiesDto?.status) {
      where.status = filterActivitiesDto.status;
    }

    if (filterActivitiesDto?.type) {
      where.type = filterActivitiesDto.type;
    }

    const activities = await this.prisma.activity.findMany({
      where: {
        date: {
          gte: new Date(),
        },
      },
      orderBy: {
        date: 'asc',
      },
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

  async registerUserToActivity(
    activityId: string,
    registerActivityDto: RegisterActivityDto,
  ) {
    const { userId } = registerActivityDto;

    console.log('🚀 [REGISTRO] Iniciando proceso de registro');
    console.log('📋 [REGISTRO] ActivityId:', activityId);
    console.log('👤 [REGISTRO] UserId:', userId);

    // Verificar que la actividad existe
    const activity = await this.prisma.activity.findUnique({
      where: { id: activityId },
    });

    if (!activity) {
      console.error('❌ [REGISTRO] Actividad no encontrada');
      throw new NotFoundException('Activity not found');
    }

    console.log('✅ [REGISTRO] Actividad encontrada:', activity.title);

    // Verificar que el usuario existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.error('❌ [REGISTRO] Usuario no encontrado');
      throw new NotFoundException('User not found');
    }

    console.log('✅ [REGISTRO] Usuario encontrado:', user.email);

    // Verificar que la actividad esté activa
    if (activity.status !== 'ACTIVE') {
      console.error(
        '❌ [REGISTRO] Actividad no está activa. Status:',
        activity.status,
      );
      throw new ConflictException('Activity is not active for registration');
    }

    console.log('✅ [REGISTRO] Actividad está activa');

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
      console.error('❌ [REGISTRO] Usuario ya está registrado');
      throw new ConflictException(
        'User is already registered for this activity',
      );
    }

    console.log('✅ [REGISTRO] Usuario no está registrado previamente');

    // Registrar al usuario en la actividad
    console.log('💾 [REGISTRO] Guardando registro en base de datos...');

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

    console.log(
      '✅ [REGISTRO] Usuario registrado exitosamente en la actividad',
    );
    console.log(
      '📊 [REGISTRO] Total usuarios registrados:',
      updatedActivity.users.length,
    );

    // Enviar correo de confirmación
    console.log('📧 [EMAIL] Iniciando proceso de envío de correo...');

    try {
      const userProfileUrl = `${envs.frontendUrl}/profile/activities`;

      console.log('🔗 [EMAIL] URL del perfil:', userProfileUrl);
      console.log('📋 [EMAIL] Datos de la actividad:');
      console.log('   - Título:', activity.title);
      console.log(
        '   - Descripción:',
        activity.description.substring(0, 50) + '...',
      );
      console.log('   - Fecha:', activity.date.toISOString());
      console.log('   - Hora:', activity.time);
      console.log('   - Link:', activity.link);
      console.log('👤 [EMAIL] Datos del usuario:');
      console.log('   - Email:', user.email);
      console.log('   - Nombre:', `${user.firstName} ${user.lastName}`);

      console.log('🚀 [EMAIL] Llamando al servicio de mailer...');

      await this.mailerService.sendActivityRegistrationEmail(
        user.email,
        `${user.firstName} ${user.lastName}`,
        {
          title: activity.title,
          description: activity.description,
          date: activity.date.toISOString(),
          time: activity.time,
          link: activity.link,
        },
        userProfileUrl,
      );

      console.log('✅ [EMAIL] Correo enviado exitosamente');
    } catch (emailError) {
      console.error('❌ [EMAIL] Error detallado al enviar correo:');
      console.error('   - Mensaje:', emailError.message);
      console.error('   - Stack:', emailError.stack);
      console.error('   - Tipo de error:', emailError.constructor.name);

      // Log adicional para errores específicos
      if (emailError.code) {
        console.error('   - Código de error:', emailError.code);
      }

      if (emailError.response) {
        console.error('   - Respuesta del servidor:', emailError.response);
      }

      // Importante: NO relanzar el error para que el registro se complete
      console.log(
        '⚠️ [EMAIL] Continuando con el registro a pesar del error de correo',
      );
    }

    console.log('🎉 [REGISTRO] Proceso completado exitosamente');

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
        activities: {
          include: {
            users: true,
          },
          orderBy: {
            date: 'desc',
          },
        },
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

  async pendientActivity(id: string) {
    const activity = await this.prisma.activity.update({
      where: { id },
      data: { status: 'DRAFT' },
    });
    return activity;
  }

  async deleteActivity(id: string) {
    await this.prisma.activity.delete({
      where: { id },
    });
    return;
  }
}
