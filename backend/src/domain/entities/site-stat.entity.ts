import { ID } from '@/domain/common/types';

export class SiteStatEntity {
  constructor(props?: Partial<SiteStatEntity>) {
    if (props) Object.assign(this, props);
  }

  id!: ID;
  label!: string;
  value!: string;
  order!: number;
  createdAt!: Date;
  updatedAt!: Date;
}
