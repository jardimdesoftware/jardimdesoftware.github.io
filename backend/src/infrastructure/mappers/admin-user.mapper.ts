import { AdminUser as PrismaAdminUser } from '@prisma/client';
import { AdminUserEntity } from '@/domain/entities/admin-user.entity';

export class AdminUserMapper {
  static toDomain(raw: PrismaAdminUser): AdminUserEntity {
    return new AdminUserEntity({
      id: raw.id,
      email: raw.email,
      password: raw.password,
      name: raw.name,
      googleId: raw.googleId,
      lastLogin: raw.lastLogin,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
