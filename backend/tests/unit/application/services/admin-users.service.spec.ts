import { Test, TestingModule } from '@nestjs/testing';
import { AdminUsersService } from '@/application/services/admin-users/admin-users.service';
import {
  IAdminUserRepository as IAdminUserRepositorySymbol,
  type IAdminUserRepository,
} from '@/domain/repositories/admin-user.repository';
import { AdminUserEntity, Role } from '@/domain/entities/admin-user.entity';
import { BusinessException } from '@/common/exceptions/business.exception';
import { EntityNotFoundException } from '@/common/exceptions/entity-not-found.exception';

describe('AdminUsersService', () => {
  let service: AdminUsersService;
  let repository: jest.Mocked<IAdminUserRepository>;

  const makeAdmin = (id: number, role: Role) =>
    new AdminUserEntity({
      id,
      email: `user${id}@jardimdesoftware.local`,
      name: `User ${id}`,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminUsersService,
        {
          provide: IAdminUserRepositorySymbol,
          useValue: {
            findById: jest.fn(),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            countByRole: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(AdminUsersService);
    repository = module.get(IAdminUserRepositorySymbol);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateRole', () => {
    it('altera o papel de outro administrador', async () => {
      repository.findById.mockResolvedValue(makeAdmin(2, Role.EDITOR));
      repository.update.mockResolvedValue(makeAdmin(2, Role.ADMIN));

      const result = await service.updateRole(2, Role.ADMIN, 1);

      expect(repository.update).toHaveBeenCalledWith(2, { role: Role.ADMIN });
      expect(result.role).toBe(Role.ADMIN);
    });

    it('não permite alterar o próprio papel', async () => {
      repository.findById.mockResolvedValue(makeAdmin(1, Role.ADMIN));

      await expect(service.updateRole(1, Role.EDITOR, 1)).rejects.toThrow(
        BusinessException,
      );
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('não permite rebaixar o único ADMIN', async () => {
      repository.findById.mockResolvedValue(makeAdmin(2, Role.ADMIN));
      repository.countByRole.mockResolvedValue(1);

      await expect(service.updateRole(2, Role.EDITOR, 1)).rejects.toThrow(
        BusinessException,
      );
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('permite rebaixar um ADMIN quando existe outro', async () => {
      repository.findById.mockResolvedValue(makeAdmin(2, Role.ADMIN));
      repository.countByRole.mockResolvedValue(2);
      repository.update.mockResolvedValue(makeAdmin(2, Role.EDITOR));

      await service.updateRole(2, Role.EDITOR, 1);

      expect(repository.update).toHaveBeenCalledWith(2, { role: Role.EDITOR });
    });

    it('lança EntityNotFoundException quando o usuário não existe', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.updateRole(9, Role.ADMIN, 1)).rejects.toThrow(
        EntityNotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('remove um EDITOR sem checar a contagem de ADMINs', async () => {
      repository.findById.mockResolvedValue(makeAdmin(2, Role.EDITOR));

      await service.remove(2, 1);

      expect(repository.countByRole).not.toHaveBeenCalled();
      expect(repository.remove).toHaveBeenCalledWith(2);
    });

    it('não permite remover o próprio acesso', async () => {
      repository.findById.mockResolvedValue(makeAdmin(1, Role.ADMIN));

      await expect(service.remove(1, 1)).rejects.toThrow(BusinessException);
      expect(repository.remove).not.toHaveBeenCalled();
    });

    it('não permite remover o único ADMIN', async () => {
      repository.findById.mockResolvedValue(makeAdmin(2, Role.ADMIN));
      repository.countByRole.mockResolvedValue(1);

      await expect(service.remove(2, 1)).rejects.toThrow(BusinessException);
      expect(repository.remove).not.toHaveBeenCalled();
    });
  });
});
