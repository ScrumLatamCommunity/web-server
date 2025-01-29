import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

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
