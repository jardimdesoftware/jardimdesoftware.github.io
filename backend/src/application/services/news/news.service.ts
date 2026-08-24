import { Injectable, Inject, Logger } from '@nestjs/common';
import { INewsPostRepository } from '@/domain/repositories/news-post.repository';
import { CreateNewsPostDto } from '@/application/dtos/news/create-news-post.dto';
import { UpdateNewsPostDto } from '@/application/dtos/news/update-news-post.dto';
import { FindNewsPostDto } from '@/application/dtos/news/find-news-post.dto';
import { EntityNotFoundException } from '@/common/exceptions/entity-not-found.exception';
import { ID } from '@/domain/common/types';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);

  constructor(
    @Inject(INewsPostRepository)
    private readonly newsPostRepository: INewsPostRepository,
  ) {}

  async findPublished(query: FindNewsPostDto) {
    const page = query.page ?? DEFAULT_PAGE;
    const limit = query.limit ?? DEFAULT_LIMIT;
    return this.newsPostRepository.findPublished(page, limit);
  }

  async findBySlugPublished(slug: string) {
    const post = await this.newsPostRepository.findBySlugPublished(slug);
    if (!post) {
      throw new EntityNotFoundException(
        `Notícia com slug "${slug}" não encontrada.`,
      );
    }
    return post;
  }

  async findAllAdmin() {
    return this.newsPostRepository.findAllAdmin();
  }

  async create(dto: CreateNewsPostDto) {
    const publishedAt = dto.published ? new Date() : undefined;
    const post = await this.newsPostRepository.create({ ...dto, publishedAt });
    this.logger.log(`Notícia criada: ${post.slug} (ID: ${post.id})`);
    return post;
  }

  async update(id: ID, dto: UpdateNewsPostDto) {
    const existing = await this.ensureExists(id);

    const publishedAt =
      dto.published && !existing.publishedAt ? new Date() : undefined;

    return this.newsPostRepository.update(id, {
      ...dto,
      ...(publishedAt ? { publishedAt } : {}),
    });
  }

  async remove(id: ID) {
    await this.ensureExists(id);
    await this.newsPostRepository.delete(id);
  }

  private async ensureExists(id: ID) {
    const post = await this.newsPostRepository.findById(id);
    if (!post) {
      throw new EntityNotFoundException(`Notícia com ID ${id} não encontrada.`);
    }
    return post;
  }
}
