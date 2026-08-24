import { TeamMember as PrismaTeamMember } from '@prisma/client';
import { TeamMemberEntity } from '@/domain/entities/team-member.entity';

export class TeamMemberMapper {
  static toDomain(raw: PrismaTeamMember): TeamMemberEntity {
    return new TeamMemberEntity({
      id: raw.id,
      slug: raw.slug,
      name: raw.name,
      roleType: raw.roleType,
      roleTitle: raw.roleTitle,
      bio: raw.bio,
      photoUrl: raw.photoUrl,
      email: raw.email,
      linkedinUrl: raw.linkedinUrl,
      githubUrl: raw.githubUrl,
      active: raw.active,
      order: raw.order,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
