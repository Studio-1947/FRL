import { ValidationPipe, VersioningType, INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

let app: INestApplication;

async function bootstrap() {
  console.log('Bootstrapping application...');
  if (!app) {
    app = await NestFactory.create(AppModule);
    console.log('Nest application created.');
    const configService = app.get(ConfigService);

    // Cookie parser
    app.use(cookieParser());

    // Security
    app.use(
      helmet({
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
              "'self'",
              "'unsafe-inline'",
              "'unsafe-eval'",
              'https://cdnjs.cloudflare.com',
            ],
            styleSrc: [
              "'self'",
              "'unsafe-inline'",
              'https://cdnjs.cloudflare.com',
              'https://fonts.googleapis.com',
            ],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            imgSrc: ["'self'", 'data:', 'validator.swagger.io'],
          },
        },
      }),
    );

    // CORS configuration
    const frontendUrl = configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    app.enableCors({
      origin: [frontendUrl],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    });

    // Global versioning (removed global 'api' prefix to avoid URI mapping conflicts)
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // Swagger Setup
    const config = new DocumentBuilder()
      .setTitle('FRL API')
      .setDescription('The FRL Backend API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      customSiteTitle: 'FRL API Documentation',
      customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2/swagger-ui.min.css',
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2/swagger-ui-bundle.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2/swagger-ui-standalone-preset.js',
      ],
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
    console.log('Swagger documentation setup completed.');

    await app.init();
    console.log('Application initialization completed.');
  }
  return app;
}

export default async function handler(req: any, res: any) {
  try {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    const application = await bootstrap();
    const instance = application.getHttpAdapter().getInstance();
    return instance(req, res);
  } catch (err) {
    console.error('CRITICAL ERROR DURING HANDLER EXECUTION:');
    console.error(err);

    // Ensure we don't leak sensitive info in production but provide enough to debug
    const errorMessage =
      process.env.NODE_ENV === 'production' ? 'Internal Server Error' : (err as Error).message;

    if (!res.headersSent) {
      res.status(500).json({
        statusCode: 500,
        message: 'A critical error occurred while processing the request.',
        error: errorMessage,
        timestamp: new Date().toISOString(),
      });
    }
  }
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  bootstrap().then(async (app) => {
    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT', 8000);
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}/v1`);
    console.log(`Swagger Docs available at: http://localhost:${port}/docs`);
  });
}
