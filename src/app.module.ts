import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DepartmentsModule } from './departments/departments.module';
import { TasksModule } from './tasks/tasks.module';
import { DocumentsModule } from './documents/documents.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ChatGateway } from './chat/chat.gateway';
import { VideoCallGateway } from './video-call/video-call.gateway';
import { RoomController } from './video-call/room/room.controller';
import { GisController } from './gis/gis.controller';
import { GisService } from './gis/gis.service';
import { LoggerModule } from './shared/logger/logger.module';
import { GuardsModule } from './shared/guards/guards.module';
import { InterceptorsModule } from './shared/interceptors/interceptors.module';
import { DecoratorsModule } from './shared/decorators/decorators.module';
import { MailerModule } from './shared/mailer/mailer.module';
import { RedisModule } from './shared/redis/redis.module';
import { UtilsModule } from './shared/utils/utils.module';
import { DatabaseModule } from './database/database.module';
import { JobsModule } from './jobs/jobs.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import {
  I18nModule,
  QueryResolver,
  AcceptLanguageResolver,
  HeaderResolver,
} from 'nestjs-i18n';
import { join } from 'path';

@Module({
  imports: [
    DatabaseModule,
    I18nModule.forRoot({
      fallbackLanguage: 'ru',
      loaderOptions: {
        path: join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),
    UsersModule,
    AuthModule,
    DepartmentsModule,
    TasksModule,
    DocumentsModule,
    NotificationsModule,
    AnalyticsModule,
    LoggerModule,
    GuardsModule,
    InterceptorsModule,
    DecoratorsModule,
    MailerModule,
    RedisModule,
    UtilsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JobsModule,
  ],
  controllers: [AppController, RoomController, GisController],
  providers: [AppService, ChatGateway, VideoCallGateway, GisService],
})
export class AppModule {}
