import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { ID } from '@/domain/common/types';
import { ProjectEntity } from '@/domain/entities/project.entity';
import { ProjectMemberEntity } from '@/domain/entities/project-member.entity';
import {
  CreateProjectData,
  IProjectRepository,
  ProjectFilters,
  ProjectMemberInput,
  UpdateProjectData,
} from '@/domain/repositories/project.repository';
import {
  handlePrismaError,
  PrismaErrorCode,
} from '@/common/utils/prisma-error-handler';
import { ProjectMapper } from '@/infrastructure/mappers/project.mapper';
import { ProjectMemberMapper } from '@/infrastructure/mappers/project-member.mapper';

const MEMBERS_INCLUDE = { members: { include: { teamMember: true } } } as const;

@Injectable()
export class PrismaProjectRepository implements IProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: ProjectFilters): Promise<ProjectEntity[]> {
    const projects = await this.prisma.project.findMany({
      where: {
        status: filters.status,
        featured: filters.featured,
        category: filters.category,
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    return projects.map((project) => ProjectMapper.toDomain(project));
  }

  async findById(id: ID): Promise<ProjectEntity | null> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: MEMBERS_INCLUDE,
    });
    return project ? ProjectMapper.toDomain(project) : null;
  }

  async findBySlug(slug: string): Promise<ProjectEntity | null> {
    const project = await this.prisma.project.findUnique({
      where: { slug },
      include: MEMBERS_INCLUDE,
    });
    return project ? ProjectMapper.toDomain(project) : null;
  }

  async create(data: CreateProjectData): Promise<ProjectEntity> {
    try {
      const project = await this.prisma.project.create({ data });
      return ProjectMapper.toDomain(project);
    } catch (error) {
      handlePrismaError(error, {
        [PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION]:
          'Já existe um projeto com este slug.',
      });
    }
  }

  async update(id: ID, data: UpdateProjectData): Promise<ProjectEntity> {
    try {
      const project = await this.prisma.project.update({
        where: { id },
        data,
      });
      return ProjectMapper.toDomain(project);
    } catch (error) {
      handlePrismaError(error, {
        [PrismaErrorCode.RECORD_NOT_FOUND]: `Projeto com ID ${id} não encontrado.`,
        [PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION]:
          'Já existe um projeto com este slug.',
      });
    }
  }

  async delete(id: ID): Promise<void> {
    try {
      await this.prisma.project.delete({ where: { id } });
    } catch (error) {
      handlePrismaError(error, {
        [PrismaErrorCode.RECORD_NOT_FOUND]: `Projeto com ID ${id} não encontrado.`,
      });
    }
  }

  async findMembers(projectId: ID): Promise<ProjectMemberEntity[]> {
    const members = await this.prisma.projectMember.findMany({
      where: { projectId },
      include: { teamMember: true },
    });
    return members.map((member) => ProjectMemberMapper.toDomain(member));
  }

  async syncMembers(
    projectId: ID,
    toCreate: ProjectMemberInput[],
    toUpdate: ProjectMemberInput[],
    toDeleteTeamMemberIds: ID[],
  ): Promise<void> {
    try {
      await this.prisma.$transaction([
        ...(toDeleteTeamMemberIds.length
          ? [
              this.prisma.projectMember.deleteMany({
                where: {
                  projectId,
                  teamMemberId: { in: toDeleteTeamMemberIds },
                },
              }),
            ]
          : []),
        ...toCreate.map((member) =>
          this.prisma.projectMember.create({
            data: {
              projectId,
              teamMemberId: member.teamMemberId,
              roleLabel: member.roleLabel ?? null,
            },
          }),
        ),
        ...toUpdate.map((member) =>
          this.prisma.projectMember.update({
            where: {
              projectId_teamMemberId: {
                projectId,
                teamMemberId: member.teamMemberId,
              },
            },
            data: { roleLabel: member.roleLabel ?? null },
          }),
        ),
      ]);
    } catch (error) {
      handlePrismaError(error, {
        [PrismaErrorCode.FOREIGN_KEY_CONSTRAINT_FAILED]:
          'Um ou mais integrantes informados não existem.',
      });
    }
  }
}
