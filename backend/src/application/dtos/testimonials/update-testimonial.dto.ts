import { PartialType } from '@nestjs/swagger';
import { CreateTestimonialDto } from '@/application/dtos/testimonials/create-testimonial.dto';

export class UpdateTestimonialDto extends PartialType(CreateTestimonialDto) {}
