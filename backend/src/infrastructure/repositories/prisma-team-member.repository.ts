import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { ID } from '@/domain/common/types';
import { TeamMemberEntity } from '@/domain/entities/team-member.entity';
import {
  CreateTeamMemberData,
  ITeamMemberRepository,
  TeamMemberFilters,
  UpdateTeamMemberData,
} from '@/domain/repositories/team-member.repository';
import {
  handlePrismaError,
  PrismaErrorCode,
} from '@/common/utils/prisma-error-handler';
import { TeamMemberMapper } from '@/infrastructure/mappers/team-member.mapper';

@Injectable()
export class PrismaTeamMemberRepository implements ITeamMemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: TeamMemberFilters): Promise<TeamMemberEntity[]> {
    const members = await this.prisma.teamMember.findMany({
      where: {
        roleType: filters.role,
        active: filters.active,
      },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });
    return members.map((member) => TeamMemberMapper.toDomain(member));
  }

  async findById(id: ID): Promise<TeamMemberEntity | null> {
    const member = await this.prisma.teamMember.findUnique({ where: { id } });
    return member ? TeamMemberMapper.toDomain(member) : null;
  }

  async findBySlug(slug: string): Promise<TeamMemberEntity | null> {
    const member = await this.prisma.teamMember.findUnique({ where: { slug } });
    return member ? TeamMemberMapper.toDomain(member) : null;
  }

  async create(data: CreateTeamMemberData): Promise<TeamMemberEntity> {
    try {
      const member = await this.prisma.teamMember.create({ data });
      return TeamMemberMapper.toDomain(member);
    } catch (error) {
      handlePrismaError(error, {
        [PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION]:
          'Já existe um integrante com este slug.',
      });
    }
  }

  async update(id: ID, data: UpdateTeamMemberData): Promise<TeamMemberEntity> {
    try {
      const member = await this.prisma.teamMember.update({
        where: { id },
        data,
      });
      return TeamMemberMapper.toDomain(member);
    } catch (error) {
      handlePrismaError(error, {
        [PrismaErrorCode.RECORD_NOT_FOUND]: `Integrante com ID ${id} não encontrado.`,
        [PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION]:
          'Já existe um integrante com este slug.',
      });
    }
  }

  async delete(id: ID): Promise<void> {
    try {
      await this.prisma.teamMember.delete({ where: { id } });
    } catch (error) {
      handlePrismaError(error, {
        [PrismaErrorCode.RECORD_NOT_FOUND]: `Integrante com ID ${id} não encontrado.`,
      });
    }
  }
}
