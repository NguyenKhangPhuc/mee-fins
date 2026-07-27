import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ZodValidationPipe } from 'nestjs-zod';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization, Cookie',
  });
  app.use(
    '/webhooks/livekit',
    bodyParser.raw({ type: 'application/webhook+json' }), // hoặc 'application/json' tùy content-type LiveKit gửi
  );
  app.getHttpAdapter().getInstance().set('trust proxy', true);
  app.useGlobalPipes(new ZodValidationPipe());
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
