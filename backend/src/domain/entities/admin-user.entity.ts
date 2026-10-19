import { ID } from '@/domain/common/types';

export const Role = {
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export class AdminUserEntity {
  constructor(props?: Partial<AdminUserEntity>) {
    if (props) Object.assign(this, props);
  }

  id!: ID;
  email!: string;
  password?: string | null;
  name?: string | null;
  googleId?: string | null;
  role!: Role;
  lastLogin?: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
}
