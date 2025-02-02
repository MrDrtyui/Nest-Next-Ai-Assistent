import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';

async function bootstrap() {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
  const app = await NestFactory.create(AppModule);
  // Разрешение всех доменов и добавление поддержки необходимых заголовков
  app.enableCors({
    origin: '*', // Разрешить конкретный домен
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization', // Разрешенные заголовки
    credentials: true, // Если нужны cookies или авторизация
  });
  await app.listen(process.env.PORT ?? 3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
