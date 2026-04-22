// apps/api/src/main.ts
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: ['http://localhost:5173', 'https://oms.midomax.vn', 'http://localhost:3000'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({ transform: true, whitelist: true }),
  );

  const config = app.get(ConfigService);
  const port = config.get<number>('API_PORT') ?? 3002;

  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 API server running on http://0.0.0.0:${port}/api`);
}

bootstrap().catch((err: unknown) => {
  console.error('Failed to start API:', err);
  process.exit(1);
});
