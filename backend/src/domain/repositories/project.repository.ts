import { ID } from '@/domain/common/types';
import { ProjectEntity, ProjectStatus } from '@/domain/entities/project.entity';
import { ProjectMemberEntity } from '@/domain/entities/project-member.entity';

export interface ProjectFilters {
  status?: ProjectStatus;
  featured?: boolean;
  category?: string;
}

export type CreateProjectData = Omit<
  ProjectEntity,
  'id' | 'createdAt' | 'updatedAt' | 'status' | 'featured' | 'order' | 'members'
> & {
  status?: ProjectStatus;
  featured?: boolean;
  order?: number;
};

export type UpdateProjectData = Partial<CreateProjectData>;

export interface ProjectMemberInput {
  teamMemberId: ID;
  roleLabel?: string | null;
}

export const IProjectRepository = Symbol('IProjectRepository');

export interface IProjectRepository {
  findAll(filters: ProjectFilters): Promise<ProjectEntity[]>;
  findById(id: ID): Promise<ProjectEntity | null>;
  findBySlug(slug: string): Promise<ProjectEntity | null>;
  create(data: CreateProjectData): Promise<ProjectEntity>;
  update(id: ID, data: UpdateProjectData): Promise<ProjectEntity>;
  delete(id: ID): Promise<void>;

  findMembers(projectId: ID): Promise<ProjectMemberEntity[]>;
  /**
   * Aplica de forma atômica (transação) a diferença de membros já calculada
   * pela camada de aplicação: cria os novos, atualiza os que mudaram de
   * roleLabel e remove os que não estão mais na lista.
   */
  syncMembers(
    projectId: ID,
    toCreate: ProjectMemberInput[],
    toUpdate: ProjectMemberInput[],
    toDeleteTeamMemberIds: ID[],
  ): Promise<void>;
}
