import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { envs } from 'src/config/envs';
import { EmailTemplateType, emailTemplates } from './templates/email-templates';
import { CalendarLinksUtil } from './utils/calendar-links.util';
import { join } from 'node:path';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.logger.log('Variables de entorno:', {
      NODE_ENV: envs.nodeEnv,
      MAIL_USER: envs.mailUser ? 'Configurado' : 'No configurado',
      MAIL_PASSWORD: envs.mailPassword ? 'Configurado' : 'No configurado',
      MAIL_FROM: envs.mailUser,
    });
    const mailUser = envs.mailUser;
    const mailPassword = envs.mailPassword;
    const isProduction = envs.nodeEnv === 'production';

    this.logger.log(`Ambiente actual: ${envs.nodeEnv}`);
    this.logger.log(
      `Usando configuración de ${isProduction ? 'producción' : 'desarrollo'}`,
    );

    if (isProduction) {
      if (!mailUser || !mailPassword) {
        this.logger.error(
          'Faltan credenciales de correo en las variables de entorno',
        );
        throw new InternalServerErrorException(
          'MAIL_USER y MAIL_PASSWORD deben estar configurados en las variables de entorno.',
        );
      }

      this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: mailUser,
          pass: mailPassword,
        },
      });

      this.logger.log('Configuración de Gmail establecida correctamente');
    } else {
      this.logger.log('Configuración de desarrollo establecida correctamente');
    }
  }

  async sendMail(
    to: string,
    subject: string,
    htmlContent: string,
  ): Promise<void> {
    try {
      this.logger.log('==========================================');
      this.logger.log('Iniciando proceso de envío de correo');
      this.logger.log(`Destinatario: ${to}`);
      this.logger.log(`Asunto: ${subject}`);

      this.logger.log(`${envs.mailFrom} - ${to} - ${subject}`);

      const mailOptions = {
        from: envs.mailFrom || '"No Reply" <no-reply@scrumlatam.com>',
        to,
        subject,
        html: htmlContent,
        attachments: [
          {
            filename: 'logo-1.png',
            path: join(__dirname, '..', '..', 'public/images/kit1.png'),
          },
          {
            filename: 'logo-2.png',
            path: join(__dirname, '..', '..', 'public/images/kit2.png'),
          },
          {
            filename: 'fondo-1.pdf',
            path: join(__dirname, '..', '..', 'public/images/kit3.pdf'),
          },
          {
            filename: 'fondo-2.pdf',
            path: join(__dirname, '..', '..', 'public/images/kit4.pdf'),
          },
          {
            filename: 'fondo-3.pdf',
            path: join(__dirname, '..', '..', 'public/images/kit5.pdf'),
          },
        ],
      };

      this.logger.log('Configuración del correo:', {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
      });

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log('Correo enviado exitosamente');
      this.logger.log(`ID del mensaje: ${info.messageId}`);
      this.logger.log(
        `URL de previsualización: ${nodemailer.getTestMessageUrl(info)}`,
      );
      this.logger.log('==========================================');

      return info;
    } catch (error) {
      this.logger.error(`Error al enviar el correo: ${error.message}`);
      throw new InternalServerErrorException(
        'Error al enviar el correo',
        error.message,
      );
    }
  }

  async sendEmail(
    to: string,
    templateType: EmailTemplateType,
    params: any,
  ): Promise<void> {
    const template = emailTemplates[templateType];

    if (!template) {
      throw new Error(`Template ${templateType} not found`);
    }

    await this.sendMail(to, template.subject, template.template(params));
  }

  async sendActivityRegistrationEmail(
    userEmail: string,
    userName: string,
    activityData: {
      title: string;
      description: string;
      date: string;
      time: string[];
      link: string;
    },
    userProfileUrl: string,
  ): Promise<void> {
    try {
      // Formatear fecha y hora
      const formattedDate = CalendarLinksUtil.formatActivityDate(
        activityData.date,
      );
      const formattedTime = CalendarLinksUtil.formatActivityTime(
        activityData.time,
      );

      // Crear fechas para el calendario (asumiendo duración de 2 horas si no se especifica)
      const startDate = new Date(activityData.date);
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 2);

      // Generar enlaces de calendario
      const calendarLinks = CalendarLinksUtil.generateCalendarLinks({
        title: activityData.title,
        description: activityData.description,
        startDate,
        endDate,
        location: activityData.link,
      });

      // Preparar parámetros para la plantilla
      const templateParams = {
        userName,
        activityTitle: activityData.title,
        activityDescription: activityData.description,
        activityDate: formattedDate,
        activityTime: formattedTime,
        activityLink: activityData.link,
        userProfileUrl,
        calendarLinks,
      };

      // Personalizar el asunto del correo
      const subject = emailTemplates[
        EmailTemplateType.ACTIVITY_REGISTRATION
      ].subject.replace('{{activityTitle}}', activityData.title);

      // Generar el contenido HTML
      const htmlContent =
        emailTemplates[EmailTemplateType.ACTIVITY_REGISTRATION].template(
          templateParams,
        );

      // Enviar el correo
      await this.sendMail(userEmail, subject, htmlContent);

      this.logger.log(
        `Correo de confirmación de actividad enviado a ${userEmail} para la actividad: ${activityData.title}`,
      );
    } catch (error) {
      this.logger.error(
        `Error al enviar correo de confirmación de actividad: ${error.message}`,
      );
      throw new InternalServerErrorException(
        'Error al enviar correo de confirmación de actividad',
        error.message,
      );
    }
  }
}
