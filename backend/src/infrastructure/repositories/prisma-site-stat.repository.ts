import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { SiteStatEntity } from '@/domain/entities/site-stat.entity';
import {
  ISiteStatRepository,
  SiteStatUpsertInput,
} from '@/domain/repositories/site-stat.repository';
import { SiteStatMapper } from '@/infrastructure/mappers/site-stat.mapper';

@Injectable()
export class PrismaSiteStatRepository implements ISiteStatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<SiteStatEntity[]> {
    const stats = await this.prisma.siteStat.findMany({
      orderBy: [{ order: 'asc' }, { id: 'asc' }],
    });
    return stats.map((stat) => SiteStatMapper.toDomain(stat));
  }

  async replaceAll(items: SiteStatUpsertInput[]): Promise<SiteStatEntity[]> {
    const idsToKeep = items
      .map((item) => item.id)
      .filter((id): id is number => id !== undefined);

    const stats = await this.prisma.$transaction(async (tx) => {
      await tx.siteStat.deleteMany({
        where: idsToKeep.length ? { id: { notIn: idsToKeep } } : {},
      });

      for (const item of items) {
        if (item.id !== undefined) {
          await tx.siteStat.update({
            where: { id: item.id },
            data: {
              label: item.label,
              value: item.value,
              order: item.order ?? 0,
            },
          });
        } else {
          await tx.siteStat.create({
            data: {
              label: item.label,
              value: item.value,
              order: item.order ?? 0,
            },
          });
        }
      }

      return tx.siteStat.findMany({
        orderBy: [{ order: 'asc' }, { id: 'asc' }],
      });
    });

    return stats.map((stat) => SiteStatMapper.toDomain(stat));
  }
}
