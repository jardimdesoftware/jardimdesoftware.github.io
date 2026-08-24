import { SiteStat as PrismaSiteStat } from '@prisma/client';
import { SiteStatEntity } from '@/domain/entities/site-stat.entity';

export class SiteStatMapper {
  static toDomain(raw: PrismaSiteStat): SiteStatEntity {
    return new SiteStatEntity({
      id: raw.id,
      label: raw.label,
      value: raw.value,
      order: raw.order,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
