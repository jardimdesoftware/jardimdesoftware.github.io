import { Injectable, Inject, Logger } from '@nestjs/common';
import { ITeamMemberRepository } from '@/domain/repositories/team-member.repository';
import { CreateTeamMemberDto } from '@/application/dtos/team-members/create-team-member.dto';
import { UpdateTeamMemberDto } from '@/application/dtos/team-members/update-team-member.dto';
import { FindTeamMemberDto } from '@/application/dtos/team-members/find-team-member.dto';
import { EntityNotFoundException } from '@/common/exceptions/entity-not-found.exception';
import { ID } from '@/domain/common/types';

@Injectable()
export class TeamMembersService {
  private readonly logger = new Logger(TeamMembersService.name);

  constructor(
    @Inject(ITeamMemberRepository)
    private readonly teamMemberRepository: ITeamMemberRepository,
  ) {}

  async findAll(filters: FindTeamMemberDto) {
    return this.teamMemberRepository.findAll(filters);
  }

  async findBySlug(slug: string) {
    const member = await this.teamMemberRepository.findBySlug(slug);
    if (!member) {
      throw new EntityNotFoundException(
        `Integrante com slug "${slug}" não encontrado.`,
      );
    }
    return member;
  }

  async create(dto: CreateTeamMemberDto) {
    const member = await this.teamMemberRepository.create(dto);
    this.logger.log(`Integrante criado: ${member.slug} (ID: ${member.id})`);
    return member;
  }

  async update(id: ID, dto: UpdateTeamMemberDto) {
    await this.ensureExists(id);
    return this.teamMemberRepository.update(id, dto);
  }

  async remove(id: ID) {
    await this.ensureExists(id);
    await this.teamMemberRepository.delete(id);
  }

  private async ensureExists(id: ID) {
    const member = await this.teamMemberRepository.findById(id);
    if (!member) {
      throw new EntityNotFoundException(
        `Integrante com ID ${id} não encontrado.`,
      );
    }
    return member;
  }
}
