import { ID } from '@/domain/common/types';
import { ProjectMemberEntity } from '@/domain/entities/project-member.entity';

export const ProjectStatus = {
  EM_DESENVOLVIMENTO: 'EM_DESENVOLVIMENTO',
  CONCLUIDO: 'CONCLUIDO',
} as const;

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];

export class ProjectEntity {
  constructor(props?: Partial<ProjectEntity>) {
    if (props) Object.assign(this, props);
  }

  id!: ID;
  slug!: string;
  title!: string;
  summary!: string;
  description!: string;
  status!: ProjectStatus;
  category?: string | null;
  repoUrl?: string | null;
  demoUrl?: string | null;
  imageUrl?: string | null;
  featured!: boolean;
  order!: number;
  createdAt!: Date;
  updatedAt!: Date;
  members?: ProjectMemberEntity[];
}
