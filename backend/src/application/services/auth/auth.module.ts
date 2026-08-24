import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@/infrastructure/infrastructure.module';
import { AuthModule as JwtAuthInfraModule } from '@/auth/auth.module';
import { AuthService } from './auth.service';

@Module({
  imports: [InfrastructureModule, JwtAuthInfraModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthApplicationModule {}
