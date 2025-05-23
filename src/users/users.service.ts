import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {
    this.prisma.$connect();
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const {
        firstName,
        lastName,
        username,
        email,
        password: pass,
        country,
        membership,
        profilePictureUrl,
      } = createUserDto;

      const hashPassword = await bcrypt.hash(pass, 10);

      return this.prisma.user.create({
        data: {
          firstName,
          lastName,
          username,
          email,
          country,
          membership,
          profilePictureUrl,
          password: hashPassword,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          sponsorsData: {
            include: {
              posts: true,
              offers: true,
            },
          },
        },
      });

      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      // Si el usuario no es SPONSOR, retornamos solo los datos básicos
      if (user.role !== 'SPONSOR') {
        const { sponsorsData, ...userData } = user;
        return userData;
      }

      // Si es SPONSOR, devolvemos toda la información
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Partial<User>> {
    try {
      // Primero, verificar si el usuario existe por su ID
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new NotFoundException(`Usuario con id ${id} no encontrado.`);
      }

      const dataToUpdate: {
        firstName?: string;
        lastName?: string;
        username?: string;
        email?: string;
        country?: string[];
      } = {};

      if (updateUserDto.firstName) {
        dataToUpdate.firstName = updateUserDto.firstName;
      }
      if (updateUserDto.lastName) {
        dataToUpdate.lastName = updateUserDto.lastName;
      }

      if (updateUserDto.username) {
        dataToUpdate.username = updateUserDto.username;
      }

      if (updateUserDto.email) {
        dataToUpdate.email = updateUserDto.email;
      }

      if (updateUserDto.country) {
        dataToUpdate.country = updateUserDto.country;
      }

      if (Object.keys(dataToUpdate).length === 0) {
        const { ...userData } = existingUser;
        return userData;
      }

      const updatedUser = await this.prisma.user.update({
        where: { id }, // La actualización se dirige únicamente por el ID del usuario
        data: dataToUpdate,
      });

      const { ...result } = updatedUser;
      return result;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      // Capturar errores de unicidad de la base de datos (si email o username son @unique en el schema)
      if (error.code === 'P2002') {
        // Código de error de Prisma para violación de restricción única
        const target = error.meta?.target as string[] | undefined;
        if (target?.includes('email')) {
          throw new BadRequestException(
            `El email '${updateUserDto.email}' ya está registrado.`,
          );
        }
        if (target?.includes('username')) {
          throw new BadRequestException(
            `El username '${updateUserDto.username}' ya está en uso.`,
          );
        }
        // Si el target no es email ni username, pero es P2002, podría ser otra restricción única.
        throw new BadRequestException('Un valor proporcionado ya está en uso.');
      }
      console.error(`Error al actualizar usuario con id ${id}:`, error);
      throw new InternalServerErrorException(
        'Ocurrió un error al actualizar el usuario.',
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });

      if (!user) {
        return null;
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async setUserPhoto(userId: string, photoUrl: string) {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: { profilePictureUrl: photoUrl },
      });

      return {
        message: 'Foto actualizada exitosamente',
        photo: user.profilePictureUrl,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
