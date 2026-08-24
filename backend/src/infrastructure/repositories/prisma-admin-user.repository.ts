import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { IAdminUserRepository } from '@/domain/repositories/admin-user.repository';
import { ID } from '@/domain/common/types';
import { AdminUserEntity } from '@/domain/entities/admin-user.entity';
import {
  handlePrismaError,
  PrismaErrorCode,
} from '@/common/utils/prisma-error-handler';
import { AdminUserMapper } from '@/infrastructure/mappers/admin-user.mapper';

@Injectable()
export class PrismaAdminUserRepository implements IAdminUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: ID): Promise<AdminUserEntity | null> {
    const adminUser = await this.prisma.adminUser.findUnique({ where: { id } });
    if (!adminUser) return null;
    return AdminUserMapper.toDomain(adminUser);
  }

  async findByEmail(email: string): Promise<AdminUserEntity | null> {
    const adminUser = await this.prisma.adminUser.findUnique({
      where: { email },
    });
    if (!adminUser) return null;
    return AdminUserMapper.toDomain(adminUser);
  }

  async findAll(): Promise<AdminUserEntity[]> {
    const adminUsers = await this.prisma.adminUser.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return adminUsers.map(AdminUserMapper.toDomain);
  }

  async create(
    data: Pick<AdminUserEntity, 'email' | 'name'>,
  ): Promise<AdminUserEntity> {
    try {
      const created = await this.prisma.adminUser.create({
        data: { email: data.email, name: data.name ?? null },
      });
      return AdminUserMapper.toDomain(created);
    } catch (error) {
      handlePrismaError(error, {
        [PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION]:
          'Já existe um administrador com este email.',
      });
    }
  }

  async update(
    id: ID,
    data: Partial<AdminUserEntity>,
  ): Promise<AdminUserEntity> {
    try {
      const updated = await this.prisma.adminUser.update({
        where: { id },
        data: {
          email: data.email ?? undefined,
          password: data.password ?? undefined,
          name: data.name ?? undefined,
          googleId: data.googleId ?? undefined,
          lastLogin: data.lastLogin ?? undefined,
        },
      });
      return AdminUserMapper.toDomain(updated);
    } catch (error) {
      handlePrismaError(error, {
        [PrismaErrorCode.RECORD_NOT_FOUND]: `Administrador com ID ${id} não encontrado.`,
        [PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION]:
          'Já existe um administrador com este email.',
      });
    }
  }

  async remove(id: ID): Promise<void> {
    try {
      await this.prisma.adminUser.delete({ where: { id } });
    } catch (error) {
      handlePrismaError(error, {
        [PrismaErrorCode.RECORD_NOT_FOUND]: `Administrador com ID ${id} não encontrado.`,
      });
    }
  }

  async count(): Promise<number> {
    return this.prisma.adminUser.count();
  }
}
