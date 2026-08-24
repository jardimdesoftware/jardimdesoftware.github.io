import { ID } from '@/domain/common/types';
import { NewsPostEntity } from '@/domain/entities/news-post.entity';

export type CreateNewsPostData = Omit<
  NewsPostEntity,
  'id' | 'createdAt' | 'updatedAt' | 'published' | 'author'
> & {
  published?: boolean;
};

export type UpdateNewsPostData = Partial<CreateNewsPostData>;

export interface Paginated<T> {
  data: T[];
  total: number;
}

export const INewsPostRepository = Symbol('INewsPostRepository');

export interface INewsPostRepository {
  findPublished(
    page: number,
    limit: number,
  ): Promise<Paginated<NewsPostEntity>>;
  findBySlugPublished(slug: string): Promise<NewsPostEntity | null>;
  findAllAdmin(): Promise<NewsPostEntity[]>;
  findById(id: ID): Promise<NewsPostEntity | null>;
  create(data: CreateNewsPostData): Promise<NewsPostEntity>;
  update(id: ID, data: UpdateNewsPostData): Promise<NewsPostEntity>;
  delete(id: ID): Promise<void>;
}
