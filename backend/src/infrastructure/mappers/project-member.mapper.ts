import {
  ProjectMember as PrismaProjectMember,
  TeamMember as PrismaTeamMember,
} from '@prisma/client';
import { ProjectMemberEntity } from '@/domain/entities/project-member.entity';
import { TeamMemberMapper } from '@/infrastructure/mappers/team-member.mapper';

type PrismaProjectMemberWithTeamMember = PrismaProjectMember & {
  teamMember?: PrismaTeamMember | null;
};

export class ProjectMemberMapper {
  static toDomain(raw: PrismaProjectMemberWithTeamMember): ProjectMemberEntity {
    return new ProjectMemberEntity({
      id: raw.id,
      projectId: raw.projectId,
      teamMemberId: raw.teamMemberId,
      roleLabel: raw.roleLabel,
      createdAt: raw.createdAt,
      teamMember: raw.teamMember
        ? TeamMemberMapper.toDomain(raw.teamMember)
        : undefined,
    });
  }
}
