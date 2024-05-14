/* eslint-disable prettier/prettier */
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import 'reflect-metadata';
import * as dotenv from 'dotenv'
import { join } from 'path';
import session from 'express-session';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ValidationExceptionFilter } from './common/dtos/validation-exception.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // const app = await NestFactory.create(AppModule);

  // const configService: ConfigService = app.get(ConfigService);

  app.enable({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  // Apply the response interceptor globally
  app.useGlobalInterceptors(new ResponseInterceptor());

   // Register the global exception filter
   app.useGlobalFilters(new ValidationExceptionFilter()); // Use the custom filter
  
  // Configure session middleware
  app.use(
    session({
      name: 'NESTJS_SESSION',
      secret: process.env.SESSION_KEY,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Trading APP API')
    .setDescription('Meta Traders')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  app.enableCors({
    allowedHeaders: ['Authorization', 'content-type'],
    origin: 'http://localhost:3000',
    credentials: true,
  });
  await app.listen(3000);
  console.log('App Running on port : 3000');
}

bootstrap();
dotenv.config();
