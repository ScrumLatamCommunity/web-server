import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/mailer/mailer.service';
import { EmailTemplateType } from 'src/mailer/templates/email-templates';
import { SponsorsService } from 'src/sponsors/sponsors.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userServices: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
    private readonly sponsorService: SponsorsService,
  ) {
    this.prisma.$connect();
  }

  async signIn(email: string, pass: string) {
    const user = await this.userServices.findOneByEmail(email);
    //Agregar acá una validacion para poder loguear desde el modelo de Sponsors

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!bcrypt.compare(pass, user.password)) {
      throw new UnauthorizedException();
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

      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async signUpSponsor(sponsorRegisterDto) {
    const {
      firstName,
      lastName,
      username,
      email,
      password: pass,
      country,
      membership,
    } = sponsorRegisterDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new UnauthorizedException(
        'El correo electrónico ya está registrado',
      );
    }

    const hashPassword = await bcrypt.hash(pass, 10);

    await this.prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        country,
        membership,
        email,
        password: hashPassword,
        onboarding: true,
      },
    });

    const newSponsor = await this.prisma.user.findUnique({
      where: { email },
    });

    newSponsor.role = 'SPONSOR';

    await this.prisma.user.update({
      where: { id: newSponsor.id },
      data: newSponsor,
    });

    const { id } = newSponsor;
    const {
      status,
      companyName,
      specialization,
      description,
      web,
      phone,
      socials,
      logo,
      bannerWeb,
      bannerMobile,
    } = sponsorRegisterDto;

    await this.sponsorService.createSponsor({
      userId: id,
      status,
      companyName,
      specialization,
      descriptions: description,
      web,
      phone,
      socials,
      logo,
      bannerWeb,
      bannerMobile,
      certificatesSponsor: [],
    });

    const newSponsorData = await this.prisma.sponsorsData.findUnique({
      where: { userId: id },
    });

    return {
      message: 'Usuario registrado exitosamente',
      newSponsor,
      newSponsorData,
    };
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

    setImmediate(() => {
      this.mailerService.sendEmail(
        user.email,
        EmailTemplateType.COMPLETED_REGISTER,
        {
          userName: user.firstName,
          url: `${process.env.FRONTEND_URL}/`,
        },
      );
    });

    return user;
  }
}
