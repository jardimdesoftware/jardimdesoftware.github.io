import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@/infrastructure/infrastructure.module';
import { AdminUsersService } from './admin-users.service';

@Module({
  imports: [InfrastructureModule],
  providers: [AdminUsersService],
  exports: [AdminUsersService],
})
export class AdminUsersApplicationModule {}
