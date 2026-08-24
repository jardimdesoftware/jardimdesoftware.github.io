import { ID } from '@/domain/common/types';
import { TestimonialEntity } from '@/domain/entities/testimonial.entity';

export interface TestimonialFilters {
  featured?: boolean;
}

export type CreateTestimonialData = Omit<
  TestimonialEntity,
  'id' | 'createdAt' | 'updatedAt' | 'featured' | 'order'
> & {
  featured?: boolean;
  order?: number;
};

export type UpdateTestimonialData = Partial<CreateTestimonialData>;

export const ITestimonialRepository = Symbol('ITestimonialRepository');

export interface ITestimonialRepository {
  findAll(filters: TestimonialFilters): Promise<TestimonialEntity[]>;
  findById(id: ID): Promise<TestimonialEntity | null>;
  create(data: CreateTestimonialData): Promise<TestimonialEntity>;
  update(id: ID, data: UpdateTestimonialData): Promise<TestimonialEntity>;
  delete(id: ID): Promise<void>;
}
