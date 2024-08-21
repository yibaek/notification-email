import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService, ConfigType } from '@nestjs/config';
import commonConfig from './config/common.config';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { ErrorFilter } from './common/filter/error.filter';
import { I18nService } from 'nestjs-i18n';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';

async function bootstrap() {
  initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const common = configService.get<ConfigType<typeof commonConfig>>('common');

  // global pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // global interceptor
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // global exception filter
  app.useGlobalFilters(
    new ErrorFilter(app.get(HttpAdapterHost), app.get(I18nService)),
  );

  const serverPort = process.env.PORT || 4051;
  await app.listen(serverPort);
  Logger.log(
    `Server Started, port: ${serverPort}, environment: ${common.nodeEnv}`,
  );
}

bootstrap().catch((error) => console.error(error));
