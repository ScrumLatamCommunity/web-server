import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerConfig } from './config/swagger.config';

async function bootstrap() {
  const { port } = envs;
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  SwaggerConfig.setupV1(app);

  await app.listen(port ?? 3000);
}
bootstrap();
