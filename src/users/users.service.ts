import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

  findOne(id: number) {
    return `This action returns a #${id} user`;
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
}
