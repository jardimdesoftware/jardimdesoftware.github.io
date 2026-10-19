import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminUsersService } from '@/application/services/admin-users/admin-users.service';
import { CreateAdminUserDto } from '@/application/dtos/admin-users/create-admin-user.dto';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/domain/entities/admin-user.entity';
import { UpdateAdminUserRoleDto } from '@/application/dtos/admin-users/update-admin-user-role.dto';

@ApiTags('Administradores (Admin)')
@ApiBearerAuth()
@Roles(Role.ADMIN)
@Controller('admin/admin-users')
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar quem tem acesso ao painel' })
  @ApiResponse({
    status: 200,
    description: 'Administradores listados com sucesso',
  })
  @ResponseMessage('Administradores listados com sucesso')
  async findAll() {
    return this.adminUsersService.findAll();
  }

  @Post()
  @ApiOperation({
    summary: 'Liberar acesso para um novo email (login via Google)',
  })
  @ApiResponse({ status: 201, description: 'Acesso liberado com sucesso' })
  @ResponseMessage('Acesso liberado com sucesso')
  async create(@Body() dto: CreateAdminUserDto) {
    return this.adminUsersService.create(dto);
  }

  @Patch(':id/role')
  @ApiOperation({ summary: 'Alterar o papel de um administrador' })
  @ApiResponse({ status: 200, description: 'Papel alterado com sucesso' })
  @ApiResponse({ status: 403, description: 'Apenas ADMIN pode alterar papéis' })
  @ResponseMessage('Papel alterado com sucesso')
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAdminUserRoleDto,
    @GetUser('id') requestingAdminId: number,
  ) {
    return this.adminUsersService.updateRole(id, dto.role, requestingAdminId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover o acesso de um administrador' })
  @ApiResponse({ status: 200, description: 'Acesso removido com sucesso' })
  @ResponseMessage('Acesso removido com sucesso')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') requestingAdminId: number,
  ) {
    await this.adminUsersService.remove(id, requestingAdminId);
    return null;
  }
}
