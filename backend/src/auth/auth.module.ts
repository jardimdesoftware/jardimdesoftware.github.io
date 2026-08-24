import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { InfrastructureModule } from '@/infrastructure/infrastructure.module';
import { JwtStrategy } from './jwt.strategy';

/**
 * Módulo de infraestrutura de autenticação: registra o PassportModule e o
 * JwtModule (usados tanto pela JwtStrategy quanto pelo AuthService da
 * camada de aplicação) e a JwtStrategy que valida o token e carrega o
 * AdminUser correspondente.
 */
@Module({
  imports: [
    InfrastructureModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService,
      ): Promise<JwtModuleOptions> => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION') || '24h',
        } as JwtModuleOptions['signOptions'],
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtStrategy],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
