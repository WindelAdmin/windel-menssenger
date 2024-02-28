import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as moment from 'moment-timezone';
import { AppModule } from './app.module';
require('dotenv').config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  moment.tz.setDefault('America/Sao_Paulo');

  app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true
      })
  )

  const config = new DocumentBuilder()
    .setTitle('Windel Menssenger API')
    .setDescription('Bem-vindo à documentação da API do Windel Menssenger')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.enableCors();
  await app.listen(3000);
}

bootstrap();
