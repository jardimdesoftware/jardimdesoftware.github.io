import { ID } from '@/domain/common/types';
import { AdminUserEntity } from '@/domain/entities/admin-user.entity';

export const IAdminUserRepository = Symbol('IAdminUserRepository');

export interface IAdminUserRepository {
  findById(id: ID): Promise<AdminUserEntity | null>;
  findByEmail(email: string): Promise<AdminUserEntity | null>;
  update(id: ID, data: Partial<AdminUserEntity>): Promise<AdminUserEntity>;
}
