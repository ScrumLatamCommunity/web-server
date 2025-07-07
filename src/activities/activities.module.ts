import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  controllers: [ActivitiesController],
  providers: [ActivitiesService, PrismaService, MailerService],
})
export class ActivitiesModule {}
