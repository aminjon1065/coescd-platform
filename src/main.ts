import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new I18nValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: 'http://localhost:3000', // Разрешаем фронтенду доступ
    credentials: true, // Разрешаем куки (refresh_token)
  });

  app.useGlobalFilters(new I18nValidationExceptionFilter());
  await app.listen(process.env.PORT ?? 8008);
}

bootstrap();
