import {
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
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
