import { ID } from '@/domain/common/types';
import { TeamMemberEntity } from '@/domain/entities/team-member.entity';

export class PublicationAuthorEntity {
  constructor(props?: Partial<PublicationAuthorEntity>) {
    if (props) Object.assign(this, props);
  }

  id!: ID;
  publicationId!: ID;
  teamMemberId?: ID | null;
  externalName?: string | null;
  createdAt!: Date;
  teamMember?: TeamMemberEntity | null;
}
