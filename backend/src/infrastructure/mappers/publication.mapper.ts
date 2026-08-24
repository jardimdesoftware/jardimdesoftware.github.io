import {
  Publication as PrismaPublication,
  PublicationAuthor as PrismaPublicationAuthor,
  TeamMember as PrismaTeamMember,
} from '@prisma/client';
import { PublicationEntity } from '@/domain/entities/publication.entity';
import { PublicationAuthorMapper } from '@/infrastructure/mappers/publication-author.mapper';

type PrismaPublicationWithAuthors = PrismaPublication & {
  authors?: (PrismaPublicationAuthor & {
    teamMember?: PrismaTeamMember | null;
  })[];
};

export class PublicationMapper {
  static toDomain(raw: PrismaPublicationWithAuthors): PublicationEntity {
    return new PublicationEntity({
      id: raw.id,
      title: raw.title,
      venue: raw.venue,
      year: raw.year,
      link: raw.link,
      order: raw.order,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      authors: raw.authors?.map((author) =>
        PublicationAuthorMapper.toDomain(author),
      ),
    });
  }
}
