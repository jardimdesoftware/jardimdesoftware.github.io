import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from '@/infrastructure/prisma/prisma.module';
import { InfrastructureModule } from '@/infrastructure/infrastructure.module';
import { AuthPresentationModule } from './modules/auth.module';
import { JwtAuthGuard } from '@/application/guards/jwt-auth.guard';
import { ResponseFormatInterceptor } from '@/common/interceptors/response-format.interceptor';
import { HealthController } from './controllers/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        path.resolve(process.cwd(), '.env'),
        path.resolve(
          process.cwd(),
          `.env.${process.env.NODE_ENV || 'development'}`,
        ),
      ],
    }),
    PrismaModule,
    InfrastructureModule,
    AuthPresentationModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseFormatInterceptor,
    },
  ],
})
export class AppModule {}
