import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';

// We will create these modules shortly
// import { PrismaModule } from './prisma/prisma.module';
import { DatabaseModule } from './database/database.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { NotesModule } from './notes/notes.module';
// import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),

    // Database
    DatabaseModule,

    UsersModule,

    AuthModule,

    NotesModule,

    PostsModule,

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'), // dist/ is two levels deep if we consider src, but wait, dist/main.js is 1 level. Next JS is different.
      // Actually dist/app.module.js -> dir is dist. So '..' -> root. Therefore: join(__dirname, '..', 'uploads')
      serveRoot: '/uploads',
    }),

    // Feature Modules
    // AuthModule,
    // UsersModule,
  ],
  providers: [
    // Global Exception Filter
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // Global transform interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
