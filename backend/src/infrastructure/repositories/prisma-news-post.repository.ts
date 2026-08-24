import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { ID } from '@/domain/common/types';
import { NewsPostEntity } from '@/domain/entities/news-post.entity';
import {
  CreateNewsPostData,
  INewsPostRepository,
  Paginated,
  UpdateNewsPostData,
} from '@/domain/repositories/news-post.repository';
import {
  handlePrismaError,
  PrismaErrorCode,
} from '@/common/utils/prisma-error-handler';
import { NewsPostMapper } from '@/infrastructure/mappers/news-post.mapper';

const AUTHOR_INCLUDE = { author: true } as const;

@Injectable()
export class PrismaNewsPostRepository implements INewsPostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findPublished(
    page: number,
    limit: number,
  ): Promise<Paginated<NewsPostEntity>> {
    const skip = (page - 1) * limit;
    const [posts, total] = await this.prisma.$transaction([
      this.prisma.newsPost.findMany({
        where: { published: true },
        include: AUTHOR_INCLUDE,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.newsPost.count({ where: { published: true } }),
    ]);
    return { data: posts.map((post) => NewsPostMapper.toDomain(post)), total };
  }

  async findBySlugPublished(slug: string): Promise<NewsPostEntity | null> {
    const post = await this.prisma.newsPost.findFirst({
      where: { slug, published: true },
      include: AUTHOR_INCLUDE,
    });
    return post ? NewsPostMapper.toDomain(post) : null;
  }

  async findAllAdmin(): Promise<NewsPostEntity[]> {
    const posts = await this.prisma.newsPost.findMany({
      include: AUTHOR_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
    return posts.map((post) => NewsPostMapper.toDomain(post));
  }

  async findById(id: ID): Promise<NewsPostEntity | null> {
    const post = await this.prisma.newsPost.findUnique({
      where: { id },
      include: AUTHOR_INCLUDE,
    });
    return post ? NewsPostMapper.toDomain(post) : null;
  }

  async create(data: CreateNewsPostData): Promise<NewsPostEntity> {
    try {
      const post = await this.prisma.newsPost.create({
        data,
        include: AUTHOR_INCLUDE,
      });
      return NewsPostMapper.toDomain(post);
    } catch (error) {
      handlePrismaError(error, {
        [PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION]:
          'Já existe uma notícia com este slug.',
        [PrismaErrorCode.FOREIGN_KEY_CONSTRAINT_FAILED]:
          'Autor informado não existe.',
      });
    }
  }

  async update(id: ID, data: UpdateNewsPostData): Promise<NewsPostEntity> {
    try {
      const post = await this.prisma.newsPost.update({
        where: { id },
        data,
        include: AUTHOR_INCLUDE,
      });
      return NewsPostMapper.toDomain(post);
    } catch (error) {
      handlePrismaError(error, {
        [PrismaErrorCode.RECORD_NOT_FOUND]: `Notícia com ID ${id} não encontrada.`,
        [PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION]:
          'Já existe uma notícia com este slug.',
        [PrismaErrorCode.FOREIGN_KEY_CONSTRAINT_FAILED]:
          'Autor informado não existe.',
      });
    }
  }

  async delete(id: ID): Promise<void> {
    try {
      await this.prisma.newsPost.delete({ where: { id } });
    } catch (error) {
      handlePrismaError(error, {
        [PrismaErrorCode.RECORD_NOT_FOUND]: `Notícia com ID ${id} não encontrada.`,
      });
    }
  }
}
