import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import ApiConfig from './config/api.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import DbConfig from './config/db.config';
import { InjectDataSource, TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import DatabaseLoggerMiddleware from './common/middleware/database-logger.middleware';
import { DataSource } from 'typeorm';
import { LoggerModule } from 'nestjs-pino';
import { clc } from '@nestjs/common/utils/cli-colors.util';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import LogConfig from './config/log.config';
import { DbHttpLoggerMiddleware } from './common/middleware/db-http-logger.middleware';
import { UsersModule } from './users/users.module';
import CacheConfig from './config/cache.config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { MailerConfig } from './config/mailer-config';
import { SecretConfig } from './config/secret.config';
import { JwtConfigModule } from './jwt/jwt.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { CommentsModule } from './reviews/comments.module';
import { BooksModule } from './Books/books.module';
import { RatingModule } from './rating/rating.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      load: [ApiConfig, CacheConfig, DbConfig, LogConfig, MailerConfig, SecretConfig],
      isGlobal: true,
    }),
    HttpModule,
    JwtConfigModule,
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          name: `api`,
          level: configService.get('api.logging'),
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              levelFirst: true,
              translateTime: 'UTC:hh:MM:ss.l',
              singleLine: true,
              messageFormat: `${clc.yellow(`[{context}]`)} ${clc.green(`{msg}`)}`,
              ignore: 'pid,hostname,context',
            },
          },
          autoLogging: !configService.get('api.test'),
          customProps: () => ({ context: 'HTTP' }),
        },
        exclude: [{ method: RequestMethod.ALL, path: 'check' }],
      }),
    }),
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          transport: {
            host: configService.get<string>('mailer.host'),
            port: configService.get<string>('mailer.port'),
            secure: configService.get<boolean>('mailer.secure'),
            auth: {
              user: configService.get<string>('mailer.auth.user'),
              pass: configService.get<string>('mailer.auth.pass'),
            },
          },
          defaults: {
            from: '"No Reply" <no-reply@gmail.com>',
          },
          template: {
            dir: join(__dirname, './templates'),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
    TerminusModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      name: 'DbConnection',
      useFactory: (configService: ConfigService) =>
        ({
          name: 'DbConnection',
          parseInt8: true,
          type: configService.get('db.connection'),
          host: configService.get('db.host'),
          port: configService.get('db.port'),
          username: configService.get('db.username'),
          password: configService.get('db.password'),
          database: configService.get('db.database'),
          autoLoadEntities: false,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
          logger: configService.get('api.test') ? false : new DatabaseLoggerMiddleware('DB'),
          maxQueryExecutionTime: configService.get('db.maxQueryExecutionTime'),
        }) as TypeOrmModuleOptions,
      inject: [ConfigService],
    }),
    UsersModule,
    CommentsModule,
    BooksModule,
    RatingModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
  constructor(
    @InjectDataSource('DbConnection')
    private readonly dbConnection: DataSource,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DbHttpLoggerMiddleware).forRoutes('*');
  }
}
