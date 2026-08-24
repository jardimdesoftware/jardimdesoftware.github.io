import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@/infrastructure/infrastructure.module';
import { NewsService } from './news.service';

@Module({
  imports: [InfrastructureModule],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsApplicationModule {}
