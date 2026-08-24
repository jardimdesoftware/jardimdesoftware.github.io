import { Module } from '@nestjs/common';
import { AdminUsersApplicationModule } from '@/application/services/admin-users/admin-users.module';
import { AdminUsersController } from '@/presentation/controllers/admin-users.controller';

@Module({
  imports: [AdminUsersApplicationModule],
  controllers: [AdminUsersController],
})
export class AdminUsersPresentationModule {}
