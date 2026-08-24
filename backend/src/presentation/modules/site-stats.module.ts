import { Module } from '@nestjs/common';
import { SiteStatsApplicationModule } from '@/application/services/site-stats/site-stats.module';
import {
  SiteStatsController,
  SiteStatsAdminController,
} from '@/presentation/controllers/site-stats.controller';

@Module({
  imports: [SiteStatsApplicationModule],
  controllers: [SiteStatsController, SiteStatsAdminController],
})
export class SiteStatsPresentationModule {}
