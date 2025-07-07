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
      console.log('📮 [SENDMAIL] Iniciando sendMail');
      console.log('📮 [SENDMAIL] Parámetros:');
      console.log('   - Destinatario:', to);
      console.log('   - Asunto:', subject);
      console.log('   - Longitud HTML:', htmlContent.length);
      console.log('   - Ambiente:', envs.nodeEnv);

      this.logger.log('==========================================');
      this.logger.log('Iniciando proceso de envío de correo');
      this.logger.log(`Destinatario: ${to}`);
      this.logger.log(`Asunto: ${subject}`);

      this.logger.log(`${envs.mailFrom} - ${to} - ${subject}`);

      console.log('📮 [SENDMAIL] Preparando opciones de correo...');

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

      console.log('📮 [SENDMAIL] Opciones de correo preparadas');
      console.log('   - From:', mailOptions.from);
      console.log('   - Attachments:', mailOptions.attachments.length);

      this.logger.log('Configuración del correo:', {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
      });

      console.log('📮 [SENDMAIL] Verificando transporter...');

      if (!this.transporter) {
        console.error('❌ [SENDMAIL] Transporter no está configurado');
        throw new Error('Email transporter is not configured');
      }

      console.log('📮 [SENDMAIL] Transporter OK, enviando correo...');

      const info = await this.transporter.sendMail(mailOptions);

      console.log('✅ [SENDMAIL] Correo enviado exitosamente');
      console.log('   - Message ID:', info.messageId);
      console.log('   - Response:', info.response);

      this.logger.log('Correo enviado exitosamente');
      this.logger.log(`ID del mensaje: ${info.messageId}`);
      this.logger.log(
        `URL de previsualización: ${nodemailer.getTestMessageUrl(info)}`,
      );
      this.logger.log('==========================================');

      return info;
    } catch (error) {
      console.error('❌ [SENDMAIL] Error detallado:');
      console.error('   - Mensaje:', error.message);
      console.error('   - Código:', error.code);
      console.error('   - Comando:', error.command);
      console.error('   - Response:', error.response);
      console.error('   - ResponseCode:', error.responseCode);
      console.error('   - Stack:', error.stack);

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
      console.log('📧 [MAILER] Iniciando sendActivityRegistrationEmail');
      console.log('📧 [MAILER] Parámetros recibidos:');
      console.log('   - Email destinatario:', userEmail);
      console.log('   - Nombre usuario:', userName);
      console.log('   - URL perfil:', userProfileUrl);

      // Formatear fecha y hora
      console.log('📧 [MAILER] Formateando fecha y hora...');
      const formattedDate = CalendarLinksUtil.formatActivityDate(
        activityData.date,
      );
      const formattedTime = CalendarLinksUtil.formatActivityTime(
        activityData.time,
      );

      console.log('   - Fecha formateada:', formattedDate);
      console.log('   - Hora formateada:', formattedTime);

      // Crear fechas para el calendario (asumiendo duración de 2 horas si no se especifica)
      console.log('📧 [MAILER] Creando fechas para calendario...');
      const startDate = new Date(activityData.date);
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 2);

      console.log('   - Fecha inicio:', startDate.toISOString());
      console.log('   - Fecha fin:', endDate.toISOString());

      // Generar enlaces de calendario
      console.log('📧 [MAILER] Generando enlaces de calendario...');
      const calendarLinks = CalendarLinksUtil.generateCalendarLinks({
        title: activityData.title,
        description: activityData.description,
        startDate,
        endDate,
        location: activityData.link,
      });

      console.log('   - Enlaces generados exitosamente');

      // Preparar parámetros para la plantilla
      console.log('📧 [MAILER] Preparando parámetros para plantilla...');
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

      console.log('   - Parámetros preparados exitosamente');

      // Personalizar el asunto del correo
      console.log('📧 [MAILER] Personalizando asunto del correo...');
      const subject = emailTemplates[
        EmailTemplateType.ACTIVITY_REGISTRATION
      ].subject.replace('{{activityTitle}}', activityData.title);

      console.log('   - Asunto:', subject);

      // Generar el contenido HTML
      console.log('📧 [MAILER] Generando contenido HTML...');
      const htmlContent =
        emailTemplates[EmailTemplateType.ACTIVITY_REGISTRATION].template(
          templateParams,
        );

      console.log(
        '   - HTML generado, longitud:',
        htmlContent.length,
        'caracteres',
      );

      // Enviar el correo
      console.log('📧 [MAILER] Enviando correo a través de sendMail...');
      await this.sendMail(userEmail, subject, htmlContent);

      console.log('✅ [MAILER] Correo enviado exitosamente');
      this.logger.log(
        `Correo de confirmación de actividad enviado a ${userEmail} para la actividad: ${activityData.title}`,
      );
    } catch (error) {
      console.error('❌ [MAILER] Error en sendActivityRegistrationEmail:');
      console.error('   - Mensaje:', error.message);
      console.error('   - Stack:', error.stack);
      console.error('   - Tipo:', error.constructor.name);

      this.logger.error(
        `Error al enviar correo de confirmación de actividad: ${error.message}`,
      );

      // Re-lanzar el error con más información
      throw new InternalServerErrorException(
        'Error al enviar correo de confirmación de actividad',
        error.message,
      );
    }
  }
}
