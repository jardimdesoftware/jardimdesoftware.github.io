import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from '@/application/services/projects/projects.service';
import {
  IProjectRepository as IProjectRepositorySymbol,
  type IProjectRepository,
} from '@/domain/repositories/project.repository';
import { ProjectEntity, ProjectStatus } from '@/domain/entities/project.entity';
import { ProjectMemberEntity } from '@/domain/entities/project-member.entity';
import { EntityNotFoundException } from '@/common/exceptions/entity-not-found.exception';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let projectRepository: jest.Mocked<IProjectRepository>;

  const mockProject = new ProjectEntity({
    id: 1,
    slug: 'projeto-teste',
    title: 'Projeto Teste',
    summary: 'Resumo',
    description: 'Descrição',
    status: ProjectStatus.EM_DESENVOLVIMENTO,
    featured: false,
    order: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: IProjectRepositorySymbol,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            findBySlug: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findMembers: jest.fn(),
            syncMembers: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    projectRepository = module.get(IProjectRepositorySymbol);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('computeMemberDiff', () => {
    it('deve identificar membros a criar quando não existem vínculos atuais', () => {
      const diff = service.computeMemberDiff(
        [],
        [{ teamMemberId: 1, roleLabel: 'Dev' }, { teamMemberId: 2 }],
      );

      expect(diff.toCreate).toEqual([
        { teamMemberId: 1, roleLabel: 'Dev' },
        { teamMemberId: 2, roleLabel: null },
      ]);
      expect(diff.toUpdate).toEqual([]);
      expect(diff.toDeleteTeamMemberIds).toEqual([]);
    });

    it('deve identificar membros a remover quando não estão mais na lista nova', () => {
      const current: Pick<ProjectMemberEntity, 'teamMemberId' | 'roleLabel'>[] =
        [
          { teamMemberId: 1, roleLabel: 'Dev' },
          { teamMemberId: 2, roleLabel: null },
        ];

      const diff = service.computeMemberDiff(current, [
        { teamMemberId: 1, roleLabel: 'Dev' },
      ]);

      expect(diff.toCreate).toEqual([]);
      expect(diff.toUpdate).toEqual([]);
      expect(diff.toDeleteTeamMemberIds).toEqual([2]);
    });

    it('deve identificar membros a atualizar quando o roleLabel muda', () => {
      const current: Pick<ProjectMemberEntity, 'teamMemberId' | 'roleLabel'>[] =
        [{ teamMemberId: 1, roleLabel: 'Dev Backend' }];

      const diff = service.computeMemberDiff(current, [
        { teamMemberId: 1, roleLabel: 'Dev Frontend' },
      ]);

      expect(diff.toCreate).toEqual([]);
      expect(diff.toUpdate).toEqual([
        { teamMemberId: 1, roleLabel: 'Dev Frontend' },
      ]);
      expect(diff.toDeleteTeamMemberIds).toEqual([]);
    });

    it('deve calcular criação, atualização e remoção simultaneamente', () => {
      const current: Pick<ProjectMemberEntity, 'teamMemberId' | 'roleLabel'>[] =
        [
          { teamMemberId: 1, roleLabel: 'Dev Backend' },
          { teamMemberId: 2, roleLabel: 'Dev Frontend' },
          { teamMemberId: 3, roleLabel: null },
        ];

      const diff = service.computeMemberDiff(current, [
        { teamMemberId: 1, roleLabel: 'Dev Backend' },
        { teamMemberId: 2, roleLabel: 'Tech Lead' },
        { teamMemberId: 4, roleLabel: 'QA' },
      ]);

      expect(diff.toCreate).toEqual([{ teamMemberId: 4, roleLabel: 'QA' }]);
      expect(diff.toUpdate).toEqual([
        { teamMemberId: 2, roleLabel: 'Tech Lead' },
      ]);
      expect(diff.toDeleteTeamMemberIds).toEqual([3]);
    });

    it('não deve gerar atualização quando roleLabel permanece igual', () => {
      const current: Pick<ProjectMemberEntity, 'teamMemberId' | 'roleLabel'>[] =
        [{ teamMemberId: 1, roleLabel: null }];

      const diff = service.computeMemberDiff(current, [{ teamMemberId: 1 }]);

      expect(diff.toUpdate).toEqual([]);
    });
  });

  describe('update', () => {
    it('deve calcular o diff a partir dos membros atuais e aplicar via syncMembers', async () => {
      projectRepository.findById.mockResolvedValue(mockProject);
      projectRepository.update.mockResolvedValue(mockProject);
      projectRepository.findMembers.mockResolvedValue([
        new ProjectMemberEntity({
          id: 10,
          projectId: 1,
          teamMemberId: 1,
          roleLabel: 'Dev Backend',
          createdAt: new Date(),
        }),
        new ProjectMemberEntity({
          id: 11,
          projectId: 1,
          teamMemberId: 2,
          roleLabel: null,
          createdAt: new Date(),
        }),
      ]);
      projectRepository.syncMembers.mockResolvedValue(undefined);
      projectRepository.findBySlug.mockResolvedValue(mockProject);

      await service.update(1, {
        members: [
          { teamMemberId: 1, roleLabel: 'Dev Backend' },
          { teamMemberId: 3, roleLabel: 'Nova integrante' },
        ],
      });

      expect(projectRepository.syncMembers).toHaveBeenCalledWith(
        1,
        [{ teamMemberId: 3, roleLabel: 'Nova integrante' }],
        [],
        [2],
      );
    });

    it('não deve chamar syncMembers quando members não é informado no update', async () => {
      projectRepository.findById.mockResolvedValue(mockProject);
      projectRepository.update.mockResolvedValue(mockProject);
      projectRepository.findBySlug.mockResolvedValue(mockProject);

      await service.update(1, { title: 'Novo título' });

      expect(projectRepository.syncMembers).not.toHaveBeenCalled();
      expect(projectRepository.findMembers).not.toHaveBeenCalled();
    });

    it('deve lançar EntityNotFoundException quando o projeto não existe', async () => {
      projectRepository.findById.mockResolvedValue(null);

      await expect(service.update(999, { title: 'X' })).rejects.toThrow(
        EntityNotFoundException,
      );
      expect(projectRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('deve criar o projeto e sincronizar membros iniciais quando informados', async () => {
      projectRepository.create.mockResolvedValue(mockProject);
      projectRepository.syncMembers.mockResolvedValue(undefined);
      projectRepository.findBySlug.mockResolvedValue(mockProject);

      await service.create({
        slug: 'projeto-teste',
        title: 'Projeto Teste',
        summary: 'Resumo',
        description: 'Descrição',
        members: [{ teamMemberId: 1, roleLabel: 'Dev' }],
      });

      expect(projectRepository.syncMembers).toHaveBeenCalledWith(
        mockProject.id,
        [{ teamMemberId: 1, roleLabel: 'Dev' }],
        [],
        [],
      );
    });

    it('não deve chamar syncMembers quando nenhum membro é informado na criação', async () => {
      projectRepository.create.mockResolvedValue(mockProject);
      projectRepository.findBySlug.mockResolvedValue(mockProject);

      await service.create({
        slug: 'projeto-teste',
        title: 'Projeto Teste',
        summary: 'Resumo',
        description: 'Descrição',
      });

      expect(projectRepository.syncMembers).not.toHaveBeenCalled();
    });
  });
});
