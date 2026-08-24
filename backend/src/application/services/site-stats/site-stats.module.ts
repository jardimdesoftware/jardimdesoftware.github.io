import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@/infrastructure/infrastructure.module';
import { SiteStatsService } from './site-stats.service';

@Module({
  imports: [InfrastructureModule],
  providers: [SiteStatsService],
  exports: [SiteStatsService],
})
export class SiteStatsApplicationModule {}
