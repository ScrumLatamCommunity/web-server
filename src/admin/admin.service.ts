import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crea los perfiles de los usuarios o sponsors que solicite
   * el perfil de administrador.
   * @param createUserDto - Datos del usuario a crear.
   */
  async createAdmin(createUserDto: CreateUserDto) {
    try {
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
   * Obtiene estadísticas generales de los usuarios.
   * Ejemplo: Número total de usuarios, desglose por país o membresía.
   */
  async getUserStats() {
    const totalUsers = await this.prisma.user.count();
    const usersByCountry = await this.prisma.user.groupBy({
      by: ['country'],
      _count: {
        country: true,
      },
    });
    const memberships = await this.prisma.user.groupBy({
      by: ['membership'],
      _count: {
        membership: true,
      },
    });

    return {
      totalUsers,
      usersByCountry,
      memberships,
    };
  }

  /**
   * Asigna un rol específico a un usuario.
   * @param userId - ID del usuario.
   * @param role - Nuevo rol a asignar.
   */
  async assignRole(userId: string, role: string) {
    const normalizedRole = role.toUpperCase() as Role;

    if (!Object.values(Role).includes(normalizedRole)) {
      throw new Error(`Invalid role: ${role}`);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { role: normalizedRole },
    });
  }

  /**
   * Obtiene la lista de usuarios con filtros opcionales.
   * @param filters - Objeto con filtros opcionales (país, membresía).
   */
  async getUsers(filters: { country?: string; membership?: string }) {
    const where: any = {};

    if (filters.country) {
      where.country = filters.country;
    }
    if (filters.membership) {
      where.membership = filters.membership;
    }

    return this.prisma.user.findMany({
      where,
    });
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
   * Elimina un usuario específico.
   * @param userId - ID del usuario.
   */
  async deleteUser(userId: string) {
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
