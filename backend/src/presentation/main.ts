import { NestFactory } from '@nestjs/core';
import { Logger, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import helmet from 'helmet';
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';
import { PrismaExceptionFilter } from '@/common/filters/prisma-exception.filter';
import { useContainer } from 'class-validator';

/**
 * Configura as opções de CORS baseadas nas variáveis de ambiente.
 */
function configureCors(configService: ConfigService): CorsOptions {
  const corsEnv = configService.get<string>('CORS_ORIGINS');
  let origin: CorsOptions['origin'] = 'http://localhost:3000';

  if (corsEnv) {
    if (corsEnv === '*' || corsEnv.toLowerCase() === 'true') {
      origin = true;
    } else {
      origin = corsEnv
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }

  return {
    origin,
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true,
  };
}

const SWAGGER_PATHS = [
  '/api-docs',
  '/api-docs/',
  '/api-docs-json',
  '/api-docs-yaml',
];

function isSwaggerEnabled(configService: ConfigService): boolean {
  const raw = configService.get<string>('SWAGGER_ENABLED');
  return raw === undefined || raw.trim().toLowerCase() !== 'false';
}

function denySwaggerAccess(app: INestApplication): void {
  const httpAdapter = app.getHttpAdapter();
  const respondForbidden = (_req: unknown, res: any) => {
    res.status(403).json({
      statusCode: 403,
      error: 'Forbidden',
      message:
        'Documentação da API (Swagger) está desabilitada neste ambiente.',
    });
  };

  SWAGGER_PATHS.forEach((path) => httpAdapter.all(path, respondForbidden));
}

function setupSwagger(
  app: INestApplication,
  configService: ConfigService,
): void {
  if (!isSwaggerEnabled(configService)) {
    denySwaggerAccess(app);
    return;
  }

  const config = new DocumentBuilder()
    .setTitle('Jardim de Software API')
    .setDescription(
      'API do site do Jardim de Software (IFPE Campus Belo Jardim)',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
}

function getAppPort(configService: ConfigService): number {
  const fromConfig = configService.get<string>('PORT');
  const fromEnv = process.env.PORT;
  const portStr = fromConfig ?? fromEnv ?? '3000';
  const port = parseInt(portStr, 10);
  return Number.isFinite(port) ? port : 3000;
}

async function logAppStatus(
  app: INestApplication,
  corsOptions: CorsOptions,
  swaggerEnabled: boolean,
): Promise<void> {
  const appUrl = await app.getUrl();

  const formatOrigin = (origin: CorsOptions['origin']): string => {
    if (origin === true) return '* (todas as origens)';
    if (Array.isArray(origin)) return origin.join(', ');
    return String(origin);
  };

  Logger.log(`Servidor rodando em ${appUrl}`, 'Bootstrap');
  Logger.log(
    swaggerEnabled
      ? `Documentação da API disponível em ${appUrl}/api-docs`
      : `Documentação da API (Swagger) desabilitada (SWAGGER_ENABLED=false) — /api-docs responde 403`,
    'Bootstrap',
  );
  Logger.log(
    `CORS habilitado para: ${formatOrigin(corsOptions.origin)}`,
    'Bootstrap',
  );
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          upgradeInsecureRequests: null,
        },
      },
    }),
  );

  const corsOptions = configureCors(configService);
  app.enableCors(corsOptions);

  app.useGlobalFilters(new PrismaExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.setGlobalPrefix('api');

  const swaggerEnabled = isSwaggerEnabled(configService);
  setupSwagger(app, configService);

  const port = getAppPort(configService);
  await app.listen(port, '0.0.0.0');

  await logAppStatus(app, corsOptions, swaggerEnabled);
}

bootstrap();
