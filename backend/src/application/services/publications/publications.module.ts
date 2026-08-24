import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@/infrastructure/infrastructure.module';
import { PublicationsService } from './publications.service';

@Module({
  imports: [InfrastructureModule],
  providers: [PublicationsService],
  exports: [PublicationsService],
})
export class PublicationsApplicationModule {}
