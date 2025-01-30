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
import { MailerService } from 'src/mailer/mailer.service';
import { EmailTemplateType } from 'src/mailer/templates/email-templates';

@Injectable()
export class AuthService {
  constructor(
    private readonly userServices: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
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

    if (!user.onboarding) {
      throw new UnauthorizedException('Usuario no ha completado el onboarding');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      onboarding: user.onboarding,
    };

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

      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new UnauthorizedException(
          'El correo electrónico ya está registrado',
        );
      }

      const hashPassword = await bcrypt.hash(pass, 10);

      const user = await this.prisma.user.create({
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

      await this.mailerService.sendEmail(
        user.email,
        EmailTemplateType.WELCOME_REGISTER,
        {
          userName: user.firstName,
          url: `${process.env.FRONTEND_URL}/onboarding`,
        },
      );

      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async onboarding(email: string, completed: boolean) {
    const user = await this.userServices.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { onboarding: completed },
    });

    await this.mailerService.sendEmail(
      user.email,
      EmailTemplateType.COMPLETED_REGISTER,
      {
        userName: user.firstName,
        url: `${process.env.FRONTEND_URL}/`,
      },
    );

    return user;
  }
}
