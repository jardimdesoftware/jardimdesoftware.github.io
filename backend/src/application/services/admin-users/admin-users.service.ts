import { Injectable, Inject, Logger } from '@nestjs/common';
import { IAdminUserRepository } from '@/domain/repositories/admin-user.repository';
import { CreateAdminUserDto } from '@/application/dtos/admin-users/create-admin-user.dto';
import { EntityNotFoundException } from '@/common/exceptions/entity-not-found.exception';
import { BusinessException } from '@/common/exceptions/business.exception';
import { ID } from '@/domain/common/types';

@Injectable()
export class AdminUsersService {
  private readonly logger = new Logger(AdminUsersService.name);

  constructor(
    @Inject(IAdminUserRepository)
    private readonly adminUserRepository: IAdminUserRepository,
  ) {}

  async findAll() {
    const admins = await this.adminUserRepository.findAll();
    return admins.map((admin) => this.toListItem(admin));
  }

  async create(dto: CreateAdminUserDto) {
    const admin = await this.adminUserRepository.create(dto);
    this.logger.log(`Acesso liberado para: ${admin.email}`);
    return this.toListItem(admin);
  }

  private toListItem(admin: {
    id: number;
    email: string;
    name?: string | null;
    password?: string | null;
    googleId?: string | null;
    lastLogin?: Date | null;
    createdAt: Date;
  }) {
    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      hasPassword: Boolean(admin.password),
      hasGoogle: Boolean(admin.googleId),
      lastLogin: admin.lastLogin,
      createdAt: admin.createdAt,
    };
  }

  async remove(id: ID, requestingAdminId: ID) {
    const admin = await this.adminUserRepository.findById(id);
    if (!admin) {
      throw new EntityNotFoundException(
        `Administrador com ID ${id} não encontrado.`,
      );
    }

    if (id === requestingAdminId) {
      throw new BusinessException(
        'Você não pode remover seu próprio acesso.',
      );
    }

    const total = await this.adminUserRepository.count();
    if (total <= 1) {
      throw new BusinessException(
        'Não é possível remover o único administrador restante.',
      );
    }

    await this.adminUserRepository.remove(id);
    this.logger.log(`Acesso removido: ${admin.email}`);
  }
}
