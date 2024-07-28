import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const port = process.env.PORT;
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());
  app.enableCors({
    origin: 'https://www.giftogether.co.kr', // 쿠키가 설정될 도메인
    credentials: true // 자격 증명이 포함된 요청을 허용
  });
  app.enableCors();
  await app.listen(port);
}
bootstrap();
