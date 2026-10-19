import { SetMetadata } from '@nestjs/common';
import { Role } from '@/domain/entities/admin-user.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
