import { Injectable, Inject, Logger } from '@nestjs/common';
import {
  IProjectRepository,
  ProjectMemberInput,
} from '@/domain/repositories/project.repository';
import { CreateProjectDto } from '@/application/dtos/projects/create-project.dto';
import { UpdateProjectDto } from '@/application/dtos/projects/update-project.dto';
import { FindProjectDto } from '@/application/dtos/projects/find-project.dto';
import { ProjectMemberInputDto } from '@/application/dtos/projects/project-member-input.dto';
import { EntityNotFoundException } from '@/common/exceptions/entity-not-found.exception';
import { ID } from '@/domain/common/types';

export interface ProjectMemberDiff {
  toCreate: ProjectMemberInput[];
  toUpdate: ProjectMemberInput[];
  toDeleteTeamMemberIds: ID[];
}

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    @Inject(IProjectRepository)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async findAll(filters: FindProjectDto) {
    return this.projectRepository.findAll(filters);
  }

  async findBySlug(slug: string) {
    const project = await this.projectRepository.findBySlug(slug);
    if (!project) {
      throw new EntityNotFoundException(
        `Projeto com slug "${slug}" não encontrado.`,
      );
    }
    return project;
  }

  async create(dto: CreateProjectDto) {
    const { members, ...data } = dto;
    const project = await this.projectRepository.create(data);

    if (members?.length) {
      await this.projectRepository.syncMembers(project.id, members, [], []);
    }

    this.logger.log(`Projeto criado: ${project.slug} (ID: ${project.id})`);
    return this.findBySlug(project.slug);
  }

  async update(id: ID, dto: UpdateProjectDto) {
    const existing = await this.ensureExists(id);
    const { members, ...data } = dto;

    await this.projectRepository.update(id, data);

    if (members) {
      const currentMembers = await this.projectRepository.findMembers(id);
      const diff = this.computeMemberDiff(currentMembers, members);
      await this.projectRepository.syncMembers(
        id,
        diff.toCreate,
        diff.toUpdate,
        diff.toDeleteTeamMemberIds,
      );
    }

    return this.findBySlug(data.slug ?? existing.slug);
  }

  async remove(id: ID) {
    await this.ensureExists(id);
    await this.projectRepository.delete(id);
  }

  /**
   * Calcula a diferença entre os membros atualmente vinculados a um projeto
   * e a lista recebida na requisição de atualização:
   * - toCreate: membros presentes na nova lista mas ainda não vinculados
   * - toUpdate: membros já vinculados cujo roleLabel mudou
   * - toDeleteTeamMemberIds: membros vinculados que não estão mais na nova lista
   */
  computeMemberDiff(
    current: { teamMemberId: ID; roleLabel?: string | null }[],
    incoming: ProjectMemberInputDto[],
  ): ProjectMemberDiff {
    const currentById = new Map(
      current.map((member) => [member.teamMemberId, member]),
    );
    const incomingIds = new Set(incoming.map((member) => member.teamMemberId));

    const toCreate: ProjectMemberInput[] = incoming
      .filter((member) => !currentById.has(member.teamMemberId))
      .map((member) => ({
        teamMemberId: member.teamMemberId,
        roleLabel: member.roleLabel ?? null,
      }));

    const toUpdate: ProjectMemberInput[] = incoming
      .filter((member) => {
        const existing = currentById.get(member.teamMemberId);
        if (!existing) return false;
        return (existing.roleLabel ?? null) !== (member.roleLabel ?? null);
      })
      .map((member) => ({
        teamMemberId: member.teamMemberId,
        roleLabel: member.roleLabel ?? null,
      }));

    const toDeleteTeamMemberIds = current
      .filter((member) => !incomingIds.has(member.teamMemberId))
      .map((member) => member.teamMemberId);

    return { toCreate, toUpdate, toDeleteTeamMemberIds };
  }

  private async ensureExists(id: ID) {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new EntityNotFoundException(`Projeto com ID ${id} não encontrado.`);
    }
    return project;
  }
}
