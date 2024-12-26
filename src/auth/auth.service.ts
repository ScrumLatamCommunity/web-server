import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userServices: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {
    this.prisma.$connect();
  }

  async signIn(email: string, pass: string) {
    const user = await this.userServices.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!bcrypt.compare(pass, user.password)) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(userDto: RegisterDto) {
    try {
      const {
        firstName,
        lastName,
        username,
        email,
        password: pass,
        country,
        membership,
      } = userDto;

      const hashPassword = await bcrypt.hash(pass, 10);

      const user = this.prisma.user.create({
        data: {
          firstName,
          lastName,
          username,
          country,
          membership,
          email,
          password: hashPassword,
        },
      });

      if (!user) {
        throw new InternalServerErrorException();
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
