import { ID } from '@/domain/common/types';
import { PublicationEntity } from '@/domain/entities/publication.entity';

export type CreatePublicationData = Omit<
  PublicationEntity,
  'id' | 'createdAt' | 'updatedAt' | 'order' | 'authors'
> & {
  order?: number;
};

export type UpdatePublicationData = Partial<CreatePublicationData>;

export interface PublicationAuthorInput {
  teamMemberId?: ID | null;
  externalName?: string | null;
}

export const IPublicationRepository = Symbol('IPublicationRepository');

export interface IPublicationRepository {
  findAll(): Promise<PublicationEntity[]>;
  findById(id: ID): Promise<PublicationEntity | null>;
  create(
    data: CreatePublicationData,
    authors: PublicationAuthorInput[],
  ): Promise<PublicationEntity>;
  update(
    id: ID,
    data: UpdatePublicationData,
    authors?: PublicationAuthorInput[],
  ): Promise<PublicationEntity>;
  delete(id: ID): Promise<void>;
}
