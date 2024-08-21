import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { EnvUtil } from './util/env.util';
import { CommonModule } from './common/common.module';
import { EmailModule } from './email/email.module';
import commonConfig from './config/common.config';
import {
  AcceptLanguageResolver,
  I18nJsonLoader,
  I18nModule,
} from 'nestjs-i18n';
import { join } from 'path';
import { SesModule } from './common/ses/ses.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataStoreConfig from './config/data-store.config';
import { HttpRequestMiddleware } from './common/middleware/http-request.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: EnvUtil.getEnvPath(),
      load: [commonConfig, dataStoreConfig],
    }),
    TypeOrmModule.forRootAsync({
      name: 'default.mongo',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const ds = configService.get<ConfigType<typeof dataStoreConfig>>('ds');
        const { database, port, host, password, username, url } = ds.mongo;

        const connectionInfo = url
          ? { url }
          : {
              host,
              port,
              username,
              password,
              database,
            };
        return {
          type: 'mongodb',
          ...connectionInfo,
          synchronize: false,
          logging: EnvUtil.isProduction() ? [] : ['query'],
          entities: [`${__dirname}/**/*.mongo.js`],
        };
      },
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'ko-KR',
      loader: I18nJsonLoader,
      loaderOptions: {
        path: join(__dirname, '..', 'public', '/i18n/'),
        watch: true,
      },
      logging: false,
      resolvers: [AcceptLanguageResolver],
    }),
    CommonModule,
    SesModule,
    EmailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(HttpRequestMiddleware).forRoutes('*');
  }
}
