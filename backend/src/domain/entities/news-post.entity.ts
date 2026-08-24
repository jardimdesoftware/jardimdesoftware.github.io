import { ID } from '@/domain/common/types';
import { TeamMemberEntity } from '@/domain/entities/team-member.entity';

export class NewsPostEntity {
  constructor(props?: Partial<NewsPostEntity>) {
    if (props) Object.assign(this, props);
  }

  id!: ID;
  slug!: string;
  title!: string;
  excerpt!: string;
  body!: string;
  coverImageUrl?: string | null;
  published!: boolean;
  publishedAt?: Date | null;
  authorId?: ID | null;
  createdAt!: Date;
  updatedAt!: Date;
  author?: TeamMemberEntity | null;
}
