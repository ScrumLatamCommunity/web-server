import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { welcomeTemplate } from './templates/email-templates';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.logger.log('Variables de entorno:', {
      NODE_ENV: process.env.NODE_ENV,
      MAIL_USER: process.env.MAIL_USER ? 'Configurado' : 'No configurado',
      MAIL_PASSWORD: process.env.MAIL_PASSWORD
        ? 'Configurado'
        : 'No configurado',
      MAIL_FROM: process.env.MAIL_FROM,
    });
    const mailUser = process.env.MAIL_USER;
    const mailPassword = process.env.MAIL_PASSWORD;
    const isProduction = process.env.NODE_ENV === 'production';

    this.logger.log(`Ambiente actual: ${process.env.NODE_ENV}`);
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
      // Configuración para pruebas con Ethereal
      this.setupTestTransport();
    }
  }

  private async setupTestTransport() {
    try {
      // Crear cuenta de prueba Ethereal
      const testAccount = await nodemailer.createTestAccount();
      this.logger.log('Cuenta de prueba Ethereal creada:', testAccount.user);

      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } catch (error) {
      this.logger.error('Error al configurar el transporte de prueba:', error);
      throw error;
    }
  }

  async sendMail(to: string, subject: string, userName: string): Promise<void> {
    try {
      this.logger.log('==========================================');
      this.logger.log('Iniciando proceso de envío de correo');
      this.logger.log(`Destinatario: ${to}`);
      this.logger.log(`Asunto: ${subject}`);

      const htmlContent = welcomeTemplate(userName);

      const mailOptions = {
        from: process.env.MAIL_FROM || '"No Reply" <no-reply@scrumlatam.com>',
        to,
        subject,
        html: htmlContent,
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
      this.logger.error('Error al enviar el correo:', error);
      throw new InternalServerErrorException(
        'Error al enviar el correo',
        error.message,
      );
    }
  }
}
