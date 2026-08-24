import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@/infrastructure/infrastructure.module';
import { TestimonialsService } from './testimonials.service';

@Module({
  imports: [InfrastructureModule],
  providers: [TestimonialsService],
  exports: [TestimonialsService],
})
export class TestimonialsApplicationModule {}
