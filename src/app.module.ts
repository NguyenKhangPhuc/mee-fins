import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './exceptions/all-exception.filter';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';
import { ZodExceptionFilter } from './exceptions/zod-exception.filter';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { QueryService } from './query/query.service';
import { QueryModule } from './query/query.module';
import { FileModule } from './file/file.module';
import { ProfileModule } from './profile/profile.module';
import { LanguagesModule } from './languages/languages.module';
import { SlotsModule } from './slots/slots.module';
import { UserLanguagesModule } from './user_languages/user_languages.module';
import { LivekitModule } from './livekit/livekit.module';
import { AuthModule } from './auth/auth.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VocabularyCollectionModule } from './vocabulary_collection/vocabulary_collection.module';
import { VocabularyWordModule } from './vocabulary_word/vocabulary_word.module';
import { SlotRatingModule } from './slot_rating/slot_rating.module';
import { EmailModule } from './email/email.module';
import { VerificationCodeModule } from './verification_code/verification_code.module';
@Module({
  imports: [AuthModule, UsersModule, PrismaModule, QueryModule, FileModule, ProfileModule, LanguagesModule, UserLanguagesModule, LivekitModule, SlotsModule,

    ConfigModule.forRoot({ isGlobal: true }),

    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get('REDIS_HOST', 'localhost'),
          port: config.get('REDIS_PORT', 6379),
          password: config.get('REDIS_PASSWORD'),
        },
      }),
    }),

    VocabularyCollectionModule,

    VocabularyWordModule,

    SlotRatingModule,

    EmailModule,

    VerificationCodeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_FILTER, useClass: ZodExceptionFilter },
    QueryService,
  ],
})
export class AppModule { }
