import { Module } from '@nestjs/common';
import { TestimonialsApplicationModule } from '@/application/services/testimonials/testimonials.module';
import {
  TestimonialsController,
  TestimonialsAdminController,
} from '@/presentation/controllers/testimonials.controller';

@Module({
  imports: [TestimonialsApplicationModule],
  controllers: [TestimonialsController, TestimonialsAdminController],
})
export class TestimonialsPresentationModule {}
