import {
  Project as PrismaProject,
  ProjectMember as PrismaProjectMember,
  TeamMember as PrismaTeamMember,
} from '@prisma/client';
import { ProjectEntity } from '@/domain/entities/project.entity';
import { ProjectMemberMapper } from '@/infrastructure/mappers/project-member.mapper';

type PrismaProjectWithMembers = PrismaProject & {
  members?: (PrismaProjectMember & { teamMember?: PrismaTeamMember | null })[];
};

export class ProjectMapper {
  static toDomain(raw: PrismaProjectWithMembers): ProjectEntity {
    return new ProjectEntity({
      id: raw.id,
      slug: raw.slug,
      title: raw.title,
      summary: raw.summary,
      description: raw.description,
      status: raw.status,
      category: raw.category,
      repoUrl: raw.repoUrl,
      demoUrl: raw.demoUrl,
      imageUrl: raw.imageUrl,
      featured: raw.featured,
      order: raw.order,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      members: raw.members?.map((member) =>
        ProjectMemberMapper.toDomain(member),
      ),
    });
  }
}
