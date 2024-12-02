import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class SwaggerConfig {
  static setupV1(app: INestApplication): void {
    const configV1 = new DocumentBuilder()
      .setTitle('API DE USUARIOS DE PRUEBA v1')
      .setDescription('Descripción de la API de usuarios v1')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const documentV1 = SwaggerModule.createDocument(app, configV1);
    SwaggerModule.setup('api/v1/docs', app, documentV1);
  }

  static setupV2(app: INestApplication): void {
    const configV2 = new DocumentBuilder()
      .setTitle('API v2')
      .setDescription('Descripción de la API v2 con nuevas funcionalidades')
      .setVersion('2.0')
      .addBearerAuth()
      .build();

    const documentV2 = SwaggerModule.createDocument(app, configV2);
    SwaggerModule.setup('api/v2/docs', app, documentV2);
  }
}
