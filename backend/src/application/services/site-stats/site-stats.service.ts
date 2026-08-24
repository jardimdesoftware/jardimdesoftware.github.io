import { Injectable, Inject, Logger } from '@nestjs/common';
import { ISiteStatRepository } from '@/domain/repositories/site-stat.repository';
import { SiteStatItemDto } from '@/application/dtos/site-stats/site-stat-item.dto';

@Injectable()
export class SiteStatsService {
  private readonly logger = new Logger(SiteStatsService.name);

  constructor(
    @Inject(ISiteStatRepository)
    private readonly siteStatRepository: ISiteStatRepository,
  ) {}

  async findAll() {
    return this.siteStatRepository.findAll();
  }

  async replaceAll(items: SiteStatItemDto[]) {
    const stats = await this.siteStatRepository.replaceAll(items);
    this.logger.log(`Estatísticas do site atualizadas (${stats.length} itens)`);
    return stats;
  }
}
