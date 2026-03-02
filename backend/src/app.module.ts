import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';

import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';

// We will create these modules shortly
// import { PrismaModule } from './prisma/prisma.module';
import { DatabaseModule } from './database/database.module';
// import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

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

    // Feature Modules
    // AuthModule,
    // UsersModule,
  ],
  providers: [
    // Global Exception Filter
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
    // Global transform interceptor
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: TransformInterceptor,
    // }
  ],
})
export class AppModule {}
