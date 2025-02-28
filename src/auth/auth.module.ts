import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwtConstants';
import { AuthGuard } from './guard/guard.guard';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { SponsorsService } from 'src/sponsors/sponsors.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
    PrismaModule,
    MailerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, SponsorsService],
  exports: [AuthGuard],
})
export class AuthModule {}
