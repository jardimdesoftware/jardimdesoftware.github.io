import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { ID } from '@/domain/common/types';
import { TestimonialEntity } from '@/domain/entities/testimonial.entity';
import {
  CreateTestimonialData,
  ITestimonialRepository,
  TestimonialFilters,
  UpdateTestimonialData,
} from '@/domain/repositories/testimonial.repository';
import {
  handlePrismaError,
  PrismaErrorCode,
} from '@/common/utils/prisma-error-handler';
import { TestimonialMapper } from '@/infrastructure/mappers/testimonial.mapper';

@Injectable()
export class PrismaTestimonialRepository implements ITestimonialRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: TestimonialFilters): Promise<TestimonialEntity[]> {
    const testimonials = await this.prisma.testimonial.findMany({
      where: { featured: filters.featured },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    return testimonials.map((testimonial) =>
      TestimonialMapper.toDomain(testimonial),
    );
  }

  async findById(id: ID): Promise<TestimonialEntity | null> {
    const testimonial = await this.prisma.testimonial.findUnique({
      where: { id },
    });
    return testimonial ? TestimonialMapper.toDomain(testimonial) : null;
  }

  async create(data: CreateTestimonialData): Promise<TestimonialEntity> {
    try {
      const testimonial = await this.prisma.testimonial.create({ data });
      return TestimonialMapper.toDomain(testimonial);
    } catch (error) {
      handlePrismaError(error, {
        [PrismaErrorCode.FOREIGN_KEY_CONSTRAINT_FAILED]:
          'Integrante ou projeto informado não existe.',
      });
    }
  }

  async update(
    id: ID,
    data: UpdateTestimonialData,
  ): Promise<TestimonialEntity> {
    try {
      const testimonial = await this.prisma.testimonial.update({
        where: { id },
        data,
      });
      return TestimonialMapper.toDomain(testimonial);
    } catch (error) {
      handlePrismaError(error, {
        [PrismaErrorCode.RECORD_NOT_FOUND]: `Depoimento com ID ${id} não encontrado.`,
        [PrismaErrorCode.FOREIGN_KEY_CONSTRAINT_FAILED]:
          'Integrante ou projeto informado não existe.',
      });
    }
  }

  async delete(id: ID): Promise<void> {
    try {
      await this.prisma.testimonial.delete({ where: { id } });
    } catch (error) {
      handlePrismaError(error, {
        [PrismaErrorCode.RECORD_NOT_FOUND]: `Depoimento com ID ${id} não encontrado.`,
      });
    }
  }
}
