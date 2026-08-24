import { ID } from '@/domain/common/types';
import { SiteStatEntity } from '@/domain/entities/site-stat.entity';

export interface SiteStatUpsertInput {
  id?: ID;
  label: string;
  value: string;
  order?: number;
}

export const ISiteStatRepository = Symbol('ISiteStatRepository');

export interface ISiteStatRepository {
  findAll(): Promise<SiteStatEntity[]>;
  /**
   * Substitui o conjunto completo de estatísticas pelo array informado:
   * atualiza os itens com `id` existente, cria os sem `id`, e remove do
   * banco qualquer estatística cujo id não esteja presente no array.
   */
  replaceAll(items: SiteStatUpsertInput[]): Promise<SiteStatEntity[]>;
}
