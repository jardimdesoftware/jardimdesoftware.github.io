import { Testimonial as PrismaTestimonial } from '@prisma/client';
import { TestimonialEntity } from '@/domain/entities/testimonial.entity';

export class TestimonialMapper {
  static toDomain(raw: PrismaTestimonial): TestimonialEntity {
    return new TestimonialEntity({
      id: raw.id,
      quote: raw.quote,
      authorName: raw.authorName,
      authorRoleLabel: raw.authorRoleLabel,
      authorPhotoUrl: raw.authorPhotoUrl,
      teamMemberId: raw.teamMemberId,
      projectId: raw.projectId,
      featured: raw.featured,
      order: raw.order,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
