import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, User, Status } from '@prisma/client';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crea los perfiles de los usuarios o sponsors que solicite
   * el perfil de administrador.
   * @param createUserDto - Datos del usuario a crear.
   */
  async createUser(createUserDto: CreateUserDto) {
    try {
      if (createUserDto.role === 'ADMIN') {
        const existingAdmin = await this.prisma.user.findFirst({
          where: { role: Role.ADMIN },
        });

        if (existingAdmin) {
          throw new Error('Solo puede existir un usuario con rol ADMIN');
        }
      }

      const existingUser = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('El usuario con este correo ya existe.');
      }

      const { password, role: _role, ...userData } = createUserDto;
      const hashPassword = await bcrypt.hash(password, 10);

      const role = _role?.toUpperCase() as Role;
      if (!Object.values(Role).includes(role)) {
        throw new ConflictException('Rol no válido.');
      }

      return this.prisma.user.create({
        data: {
          ...userData,
          role,
          password: hashPassword,
          sponsorsData:
            role === Role.SPONSOR
              ? {
                  create: {
                    companyName: 'Empresa sin nombre', // 🔹 Dato obligatorio
                    specialization: 'Sin especialización',
                    description: 'Descripción no proporcionada',
                    web: 'https://example.com',
                    phone: '', // 🔹 Asegurar que sea String
                    socials: [],
                    logo: 'https://example.com/default-logo.png',
                    bannerWeb: 'https://example.com/default-banner-web.png',
                    bannerMobile:
                      'https://example.com/default-banner-mobile.png',
                    status: Status.INACTIVE, // ✅ Enum correcto
                  },
                }
              : undefined,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Este correo electrónico ya está registrado.',
        );
      }
      throw new InternalServerErrorException('Error al crear el usuario.');
    }
  }

  /**
   * Asigna un rol específico a un usuario.
   * @param userId - ID del usuario.
   * @param role - Nuevo rol a asignar.
   */
  async assignRole(userId: string, role: string) {
    const normalizedRole = role.toUpperCase() as Role;

    if (normalizedRole === Role.ADMIN) {
      const existingAdmin = await this.prisma.user.findFirst({
        where: { role: Role.ADMIN },
      });

      if (existingAdmin) {
        throw new Error('Solo puede existir un usuario con rol ADMIN');
      }
    }

    if (!Object.values(Role).includes(normalizedRole)) {
      throw new Error(`Rol inválido: ${role}`);
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { role: normalizedRole },
    });

    if (normalizedRole === Role.SPONSOR) {
      const existingSponsor = await this.prisma.sponsorsData.findUnique({
        where: { userId },
      });

      if (!existingSponsor) {
        await this.prisma.sponsorsData.create({
          data: {
            userId,
            companyName: 'Empresa sin nombre', // 🔹 Dato obligatorio
            specialization: 'Sin especialización',
            description: 'Descripción no proporcionada',
            web: 'https://example.com',
            phone: '', // 🔹 Asegurar que sea String
            socials: [],
            logo: 'https://example.com/default-logo.png',
            bannerWeb: 'https://example.com/default-banner-web.png',
            bannerMobile: 'https://example.com/default-banner-mobile.png',
            status: Status.INACTIVE, // ✅ Enum correcto
          },
        });
      }
    }

    return user;
  }

  /**
   * Obtiene una lista de usuarios con opciones de filtrado y ordenación.
   * @param filters - Filtros para la consulta.
   * @param sortBy - Campo por el cual ordenar los resultados.
   * @param order - Orden de los resultados ('asc' o 'desc').
   */
  async getUsers(
    filters: { country?: string; membership?: string; role?: string },
    sortBy?: keyof User,
    order: 'asc' | 'desc' = 'asc',
  ) {
    const where: any = {};

    if (filters.country) where.country = filters.country;
    if (filters.membership) where.membership = filters.membership;
    if (filters.role) where.role = filters.role;

    const users = await this.prisma.user.findMany({
      where,
      include: { sponsorsData: true },
    });

    if (sortBy) {
      users.sort((a, b) => {
        if (a[sortBy]! < b[sortBy]!) return order === 'asc' ? -1 : 1;
        if (a[sortBy]! > b[sortBy]!) return order === 'desc' ? 1 : -1;
        return 0;
      });
    }

    return users;
  }

  /**
   * Actualiza los datos de un usuario específico.
   * @param userId - ID del usuario.
   * @param data - Datos a actualizar del usuario.
   */
  async updateUser(
    userId: string,
    data: Partial<{
      firstName: string;
      lastName: string;
      country: string;
      membership: string;
    }>,
  ) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  /**
   * Actualiza el estado de un Sponsor
   * @param userId - ID del usuario que tiene el perfil de Sponsor
   * @param status - Nuevo estado (ACTIVE o INACTIVE)
   */
  async updateSponsorStatus(userId: string, newStatus: Status) {
    const sponsor = await this.prisma.sponsorsData.findUnique({
      where: { userId },
    });

    if (!sponsor) {
      throw new Error('El usuario no tiene un perfil de Sponsor.');
    }

    if (!Object.values(Status).includes(newStatus)) {
      throw new Error(`Estado inválido: ${newStatus}`);
    }

    return this.prisma.sponsorsData.update({
      where: { userId },
      data: { status: newStatus },
    });
  }

  /**
   * Elimina un usuario específico.
   * @param userId - ID del usuario.
   */
  async deleteUser(userId: string) {
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
