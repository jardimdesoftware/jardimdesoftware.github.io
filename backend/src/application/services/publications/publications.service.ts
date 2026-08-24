import { Injectable, Inject, Logger } from '@nestjs/common';
import { IPublicationRepository } from '@/domain/repositories/publication.repository';
import { CreatePublicationDto } from '@/application/dtos/publications/create-publication.dto';
import { UpdatePublicationDto } from '@/application/dtos/publications/update-publication.dto';
import { EntityNotFoundException } from '@/common/exceptions/entity-not-found.exception';
import { ID } from '@/domain/common/types';

@Injectable()
export class PublicationsService {
  private readonly logger = new Logger(PublicationsService.name);

  constructor(
    @Inject(IPublicationRepository)
    private readonly publicationRepository: IPublicationRepository,
  ) {}

  async findAll() {
    return this.publicationRepository.findAll();
  }

  async create(dto: CreatePublicationDto) {
    const { authors, ...data } = dto;
    const publication = await this.publicationRepository.create(
      data,
      authors ?? [],
    );
    this.logger.log(
      `Publicação criada: ${publication.title} (ID: ${publication.id})`,
    );
    return publication;
  }

  async update(id: ID, dto: UpdatePublicationDto) {
    await this.ensureExists(id);
    const { authors, ...data } = dto;
    return this.publicationRepository.update(id, data, authors);
  }

  async remove(id: ID) {
    await this.ensureExists(id);
    await this.publicationRepository.delete(id);
  }

  private async ensureExists(id: ID) {
    const publication = await this.publicationRepository.findById(id);
    if (!publication) {
      throw new EntityNotFoundException(
        `Publicação com ID ${id} não encontrada.`,
      );
    }
    return publication;
  }
}
