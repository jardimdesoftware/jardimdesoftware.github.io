import { Injectable, Inject, Logger } from '@nestjs/common';
import { ITestimonialRepository } from '@/domain/repositories/testimonial.repository';
import { CreateTestimonialDto } from '@/application/dtos/testimonials/create-testimonial.dto';
import { UpdateTestimonialDto } from '@/application/dtos/testimonials/update-testimonial.dto';
import { FindTestimonialDto } from '@/application/dtos/testimonials/find-testimonial.dto';
import { EntityNotFoundException } from '@/common/exceptions/entity-not-found.exception';
import { ID } from '@/domain/common/types';

@Injectable()
export class TestimonialsService {
  private readonly logger = new Logger(TestimonialsService.name);

  constructor(
    @Inject(ITestimonialRepository)
    private readonly testimonialRepository: ITestimonialRepository,
  ) {}

  async findAll(filters: FindTestimonialDto) {
    return this.testimonialRepository.findAll(filters);
  }

  async create(dto: CreateTestimonialDto) {
    const testimonial = await this.testimonialRepository.create(dto);
    this.logger.log(`Depoimento criado (ID: ${testimonial.id})`);
    return testimonial;
  }

  async update(id: ID, dto: UpdateTestimonialDto) {
    await this.ensureExists(id);
    return this.testimonialRepository.update(id, dto);
  }

  async remove(id: ID) {
    await this.ensureExists(id);
    await this.testimonialRepository.delete(id);
  }

  private async ensureExists(id: ID) {
    const testimonial = await this.testimonialRepository.findById(id);
    if (!testimonial) {
      throw new EntityNotFoundException(
        `Depoimento com ID ${id} não encontrado.`,
      );
    }
    return testimonial;
  }
}
