import { ID } from '@/domain/common/types';

export class TestimonialEntity {
  constructor(props?: Partial<TestimonialEntity>) {
    if (props) Object.assign(this, props);
  }

  id!: ID;
  quote!: string;
  authorName!: string;
  authorRoleLabel?: string | null;
  authorPhotoUrl?: string | null;
  teamMemberId?: ID | null;
  projectId?: ID | null;
  featured!: boolean;
  order!: number;
  createdAt!: Date;
  updatedAt!: Date;
}
