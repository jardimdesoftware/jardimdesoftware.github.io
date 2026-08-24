import { ID } from '@/domain/common/types';

export const TeamRole = {
  DOCENTE: 'DOCENTE',
  DISCENTE: 'DISCENTE',
} as const;

export type TeamRole = (typeof TeamRole)[keyof typeof TeamRole];

export class TeamMemberEntity {
  constructor(props?: Partial<TeamMemberEntity>) {
    if (props) Object.assign(this, props);
  }

  id!: ID;
  slug!: string;
  name!: string;
  roleType!: TeamRole;
  roleTitle?: string | null;
  bio!: string;
  photoUrl?: string | null;
  email?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  active!: boolean;
  order!: number;
  createdAt!: Date;
  updatedAt!: Date;
}
