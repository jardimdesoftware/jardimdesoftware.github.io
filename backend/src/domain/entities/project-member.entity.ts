import { ID } from '@/domain/common/types';
import { TeamMemberEntity } from '@/domain/entities/team-member.entity';

export class ProjectMemberEntity {
  constructor(props?: Partial<ProjectMemberEntity>) {
    if (props) Object.assign(this, props);
  }

  id!: ID;
  projectId!: ID;
  teamMemberId!: ID;
  roleLabel?: string | null;
  createdAt!: Date;
  teamMember?: TeamMemberEntity | null;
}
