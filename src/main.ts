import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ZodValidationPipe } from 'nestjs-zod';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.getHttpAdapter().getInstance().set('trust proxy', true);
  app.useGlobalPipes(new ZodValidationPipe());
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
