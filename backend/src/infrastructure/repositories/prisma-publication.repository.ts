import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { ID } from '@/domain/common/types';
import { PublicationEntity } from '@/domain/entities/publication.entity';
import {
  CreatePublicationData,
  IPublicationRepository,
  PublicationAuthorInput,
  UpdatePublicationData,
} from '@/domain/repositories/publication.repository';
import {
  handlePrismaError,
  PrismaErrorCode,
} from '@/common/utils/prisma-error-handler';
import { PublicationMapper } from '@/infrastructure/mappers/publication.mapper';

const AUTHORS_INCLUDE = { authors: { include: { teamMember: true } } } as const;

@Injectable()
export class PrismaPublicationRepository implements IPublicationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<PublicationEntity[]> {
    const publications = await this.prisma.publication.findMany({
      include: AUTHORS_INCLUDE,
      orderBy: [{ order: 'asc' }, { year: 'desc' }],
    });
    return publications.map((publication) =>
      PublicationMapper.toDomain(publication),
    );
  }

  async findById(id: ID): Promise<PublicationEntity | null> {
    const publication = await this.prisma.publication.findUnique({
      where: { id },
      include: AUTHORS_INCLUDE,
    });
    return publication ? PublicationMapper.toDomain(publication) : null;
  }

  async create(
    data: CreatePublicationData,
    authors: PublicationAuthorInput[],
  ): Promise<PublicationEntity> {
    try {
      const publication = await this.prisma.publication.create({
        data: {
          ...data,
          authors: {
            create: authors.map((author) => ({
              teamMemberId: author.teamMemberId ?? null,
              externalName: author.externalName ?? null,
            })),
          },
        },
        include: AUTHORS_INCLUDE,
      });
      return PublicationMapper.toDomain(publication);
    } catch (error) {
      handlePrismaError(error, {
        [PrismaErrorCode.FOREIGN_KEY_CONSTRAINT_FAILED]:
          'Um ou mais autores informados não existem.',
      });
    }
  }

  async update(
    id: ID,
    data: UpdatePublicationData,
    authors?: PublicationAuthorInput[],
  ): Promise<PublicationEntity> {
    try {
      const publication = await this.prisma.$transaction(async (tx) => {
        await tx.publication.update({ where: { id }, data });

        if (authors) {
          await tx.publicationAuthor.deleteMany({
            where: { publicationId: id },
          });
          if (authors.length) {
            await tx.publicationAuthor.createMany({
              data: authors.map((author) => ({
                publicationId: id,
                teamMemberId: author.teamMemberId ?? null,
                externalName: author.externalName ?? null,
              })),
            });
          }
        }

        return tx.publication.findUniqueOrThrow({
          where: { id },
          include: AUTHORS_INCLUDE,
        });
      });
      return PublicationMapper.toDomain(publication);
    } catch (error) {
      handlePrismaError(error, {
        [PrismaErrorCode.RECORD_NOT_FOUND]: `Publicação com ID ${id} não encontrada.`,
        [PrismaErrorCode.FOREIGN_KEY_CONSTRAINT_FAILED]:
          'Um ou mais autores informados não existem.',
      });
    }
  }

  async delete(id: ID): Promise<void> {
    try {
      await this.prisma.publication.delete({ where: { id } });
    } catch (error) {
      handlePrismaError(error, {
        [PrismaErrorCode.RECORD_NOT_FOUND]: `Publicação com ID ${id} não encontrada.`,
      });
    }
  }
}
