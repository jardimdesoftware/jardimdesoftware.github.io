import { ID } from '@/domain/common/types';
import {
  TeamMemberEntity,
  TeamRole,
} from '@/domain/entities/team-member.entity';

export interface TeamMemberFilters {
  role?: TeamRole;
  active?: boolean;
}

export type CreateTeamMemberData = Omit<
  TeamMemberEntity,
  'id' | 'createdAt' | 'updatedAt' | 'active' | 'order'
> & {
  active?: boolean;
  order?: number;
};

export type UpdateTeamMemberData = Partial<CreateTeamMemberData>;

export const ITeamMemberRepository = Symbol('ITeamMemberRepository');

export interface ITeamMemberRepository {
  findAll(filters: TeamMemberFilters): Promise<TeamMemberEntity[]>;
  findById(id: ID): Promise<TeamMemberEntity | null>;
  findBySlug(slug: string): Promise<TeamMemberEntity | null>;
  create(data: CreateTeamMemberData): Promise<TeamMemberEntity>;
  update(id: ID, data: UpdateTeamMemberData): Promise<TeamMemberEntity>;
  delete(id: ID): Promise<void>;
}
