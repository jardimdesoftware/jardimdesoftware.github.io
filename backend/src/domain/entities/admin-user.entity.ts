import { ID } from '@/domain/common/types';

export class AdminUserEntity {
  constructor(props?: Partial<AdminUserEntity>) {
    if (props) Object.assign(this, props);
  }

  id!: ID;
  email!: string;
  password?: string | null;
  name?: string | null;
  googleId?: string | null;
  lastLogin?: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
}
