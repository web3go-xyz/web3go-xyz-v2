import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';
import { W3ExceptionsFilter } from './base/filter/W3ExceptionFilter';
import { AppConfig } from './base/setting/appConfig';
import "reflect-metadata";
import { json, urlencoded } from 'express';

async function bootstrap() {

  global.IS_ENABLE_CRON = process.env.IS_ENABLE_CRON || process.env.TERM_PROGRAM !== "vscode";

  console.log(`process.env:`, process.env);
  AppConfig.initilize();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useLogger(['debug', 'log', 'verbose', 'error', 'warn']);
  app.useGlobalPipes(new ValidationPipe());
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('api-service')
    .setDescription('')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api', app, document);

  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/' + AppConfig.STATIC_ASSET_DIR,
  });

  app.useGlobalFilters(new W3ExceptionsFilter());
  await app.listen(process.env.PORT || AppConfig.PORT);
}
bootstrap();


