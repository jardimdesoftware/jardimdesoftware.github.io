import { Module } from '@nestjs/common';
import { AuthApplicationModule } from '@/application/services/auth/auth.module';
import { AuthController } from '@/presentation/controllers/auth.controller';

@Module({
  imports: [AuthApplicationModule],
  controllers: [AuthController],
})
export class AuthPresentationModule {}
