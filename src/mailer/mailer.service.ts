import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const mailUser = process.env.MAIL_USER;
    const mailPassword = process.env.MAIL_PASSWORD;

    if (!mailUser || !mailPassword) {
      throw new InternalServerErrorException(
        'MAIL_USER y MAIL_PASSWORD deben estar configurados en las variables de entorno.',
      );
    }

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: false,
      auth: {
        user: mailUser,
        pass: mailPassword,
      },
    });
  }

  async sendMail(to: string, subject: string, userName: string): Promise<void> {
    try {
      const templatePath = path.join(__dirname, 'mail.format.html');
      let htmlContent = fs.readFileSync(templatePath, 'utf-8');

      htmlContent = htmlContent.replace(/{{userName}}/g, userName);

      const mailOptions = {
        from: process.env.MAIL_FROM || '"No Reply" <no-reply@tu-dominio.com>',
        to,
        subject,
        html: htmlContent,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Correo enviado a ${to}`);
    } catch (error) {
      console.error('Error enviando correo:', error);
      throw error;
    }
  }
}
