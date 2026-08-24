import { ID } from '@/domain/common/types';
import { AdminUserEntity } from '@/domain/entities/admin-user.entity';

export const IAdminUserRepository = Symbol('IAdminUserRepository');

export interface IAdminUserRepository {
  findById(id: ID): Promise<AdminUserEntity | null>;
  findByEmail(email: string): Promise<AdminUserEntity | null>;
  findAll(): Promise<AdminUserEntity[]>;
  create(data: Pick<AdminUserEntity, 'email' | 'name'>): Promise<AdminUserEntity>;
  update(id: ID, data: Partial<AdminUserEntity>): Promise<AdminUserEntity>;
  remove(id: ID): Promise<void>;
  count(): Promise<number>;
}
