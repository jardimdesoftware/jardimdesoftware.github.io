import { ID } from '@/domain/common/types';
import { PublicationAuthorEntity } from '@/domain/entities/publication-author.entity';

export class PublicationEntity {
  constructor(props?: Partial<PublicationEntity>) {
    if (props) Object.assign(this, props);
  }

  id!: ID;
  title!: string;
  venue?: string | null;
  year!: number;
  link?: string | null;
  order!: number;
  createdAt!: Date;
  updatedAt!: Date;
  authors?: PublicationAuthorEntity[];
}
