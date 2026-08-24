import {
  PublicationAuthor as PrismaPublicationAuthor,
  TeamMember as PrismaTeamMember,
} from '@prisma/client';
import { PublicationAuthorEntity } from '@/domain/entities/publication-author.entity';
import { TeamMemberMapper } from '@/infrastructure/mappers/team-member.mapper';

type PrismaPublicationAuthorWithTeamMember = PrismaPublicationAuthor & {
  teamMember?: PrismaTeamMember | null;
};

export class PublicationAuthorMapper {
  static toDomain(
    raw: PrismaPublicationAuthorWithTeamMember,
  ): PublicationAuthorEntity {
    return new PublicationAuthorEntity({
      id: raw.id,
      publicationId: raw.publicationId,
      teamMemberId: raw.teamMemberId,
      externalName: raw.externalName,
      createdAt: raw.createdAt,
      teamMember: raw.teamMember
        ? TeamMemberMapper.toDomain(raw.teamMember)
        : undefined,
    });
  }
}
