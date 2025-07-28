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
import * as bcrypt from 'bcryptjs';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {
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
    return this.prisma.user.findMany({
      include: {
        activities: {
          include: {
            users: true,
          },
        },
      },
    });
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
        console.log(sponsorsData);
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
        profilePictureUrl?: string;
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
      if (updateUserDto.profilePictureUrl) {
        dataToUpdate.profilePictureUrl = updateUserDto.profilePictureUrl;
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

  async setUserPhoto(
    userId: string,
    photoUrl: string, // <--- Espera un string para la URL
    cloudinaryId: string, // <--- Espera un string para el ID de Cloudinary
  ): Promise<Omit<User, 'password'>> {
    try {
      const updatedUserWithPassword = await this.prisma.user.update({
        where: { id: userId },
        data: {
          profilePictureUrl: photoUrl, // Guarda la URL (string)
          profilePictureCloudinaryId: cloudinaryId, // Guarda el ID de Cloudinary (string)
        },
      });

      if (!updatedUserWithPassword) {
        throw new NotFoundException(
          `Usuario con id ${userId} no encontrado al intentar actualizar la foto.`,
        );
      }

      const { password, ...userResponse } = updatedUserWithPassword;
      console.log(password);
      return userResponse;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Usuario con id ${userId} no encontrado al intentar actualizar la foto.`,
        );
      }
      console.error('Error en setUserPhoto:', error);
      throw new InternalServerErrorException(
        'Error al guardar la información de la foto de perfil.',
      );
    }
  }

  async updateUserProfilePicture(
    userId: string,
    file: Express.Multer.File, // Recibe el archivo aquí
  ): Promise<Omit<User, 'password'>> {
    const currentUser = await this.findOne(userId); // findOne debe devolver el usuario o null/lanzar error

    if (!currentUser) {
      // Esta verificación es importante si findOne puede devolver null.
      // Si findOne ya lanza NotFoundException, esta podría ser redundante, pero no hace daño.
      throw new NotFoundException(`Usuario con id ${userId} no encontrado.`);
    }

    if (currentUser.profilePictureCloudinaryId) {
      // Verifica si hay un ID de imagen antigua guardado
      try {
        console.log(
          `Intentando eliminar imagen antigua de Cloudinary: ${currentUser.profilePictureCloudinaryId}`,
        );
        await this.cloudinaryService.deleteImage(
          currentUser.profilePictureCloudinaryId,
        );
        console.log(
          `Imagen antigua ${currentUser.profilePictureCloudinaryId} eliminada exitosamente de Cloudinary para el usuario ${userId}.`,
        );

        // Opcional: Podrías querer limpiar el campo profilePictureCloudinaryId en la BD aquí mismo
        // si la subida de la nueva imagen fallara por alguna razón después de este punto,
        // aunque usualmente se actualiza todo junto con la nueva URL.
        // await this.prisma.user.update({
        //   where: { id: userId },
        //   data: { profilePictureCloudinaryId: null, profilePictureUrl: null }, // Limpiar campos
        // });
      } catch (deleteError) {
        // Es importante decidir si un fallo al borrar la imagen antigua debe detener el proceso.
        // Generalmente, se prefiere continuar y subir la nueva imagen, solo registrando la advertencia.
        console.warn(
          `Advertencia: No se pudo eliminar la imagen antigua (${currentUser.profilePictureCloudinaryId}) de Cloudinary para el usuario ${userId}. Error: ${deleteError.message || deleteError}`,
        );
      }
    }

    const uploadResult = await this.cloudinaryService.uploadImage(
      file, // Pasa el archivo al servicio de Cloudinary
      'profile_pictures',
      userId,
    );

    // Llama a setUserPhoto con los strings resultantes de la subida
    return this.setUserPhoto(
      // Aquí se pasan strings
      userId,
      uploadResult.secure_url, // Esto es un string
      uploadResult.public_id, // Esto es un string
    );
  }
}
