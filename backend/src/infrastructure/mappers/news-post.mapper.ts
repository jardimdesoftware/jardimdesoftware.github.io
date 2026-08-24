import {
  NewsPost as PrismaNewsPost,
  TeamMember as PrismaTeamMember,
} from '@prisma/client';
import { NewsPostEntity } from '@/domain/entities/news-post.entity';
import { TeamMemberMapper } from '@/infrastructure/mappers/team-member.mapper';

type PrismaNewsPostWithAuthor = PrismaNewsPost & {
  author?: PrismaTeamMember | null;
};

export class NewsPostMapper {
  static toDomain(raw: PrismaNewsPostWithAuthor): NewsPostEntity {
    return new NewsPostEntity({
      id: raw.id,
      slug: raw.slug,
      title: raw.title,
      excerpt: raw.excerpt,
      body: raw.body,
      coverImageUrl: raw.coverImageUrl,
      published: raw.published,
      publishedAt: raw.publishedAt,
      authorId: raw.authorId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      author: raw.author ? TeamMemberMapper.toDomain(raw.author) : undefined,
    });
  }
}
