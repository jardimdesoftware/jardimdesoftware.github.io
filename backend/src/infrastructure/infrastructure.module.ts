import { Module } from '@nestjs/common';
import { PrismaModule } from '@/infrastructure/prisma/prisma.module';
import { PrismaAdminUserRepository } from '@/infrastructure/repositories/prisma-admin-user.repository';
import { IAdminUserRepository } from '@/domain/repositories/admin-user.repository';
import { IHashService } from '@/application/ports/hash.service';
import { BcryptHashService } from '@/infrastructure/services/bcrypt-hash.service';

@Module({
  imports: [PrismaModule],
  providers: [
    { provide: IAdminUserRepository, useClass: PrismaAdminUserRepository },
    { provide: IHashService, useClass: BcryptHashService },
  ],
  exports: [PrismaModule, IAdminUserRepository, IHashService],
})
export class InfrastructureModule {}
