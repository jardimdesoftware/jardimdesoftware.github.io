import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TeamMembersService } from '@/application/services/team-members/team-members.service';
import { CreateTeamMemberDto } from '@/application/dtos/team-members/create-team-member.dto';
import { UpdateTeamMemberDto } from '@/application/dtos/team-members/update-team-member.dto';
import { FindTeamMemberDto } from '@/application/dtos/team-members/find-team-member.dto';
import { Public } from '@/common/decorators/public.decorator';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';

@ApiTags('Integrantes')
@Controller('team-members')
export class TeamMembersController {
  constructor(private readonly teamMembersService: TeamMembersService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Listar integrantes da equipe' })
  @ApiResponse({ status: 200, description: 'Integrantes listados com sucesso' })
  @ResponseMessage('Integrantes listados com sucesso')
  async findAll(@Query() query: FindTeamMemberDto) {
    return this.teamMembersService.findAll(query);
  }

  @Get(':slug')
  @Public()
  @ApiOperation({ summary: 'Buscar um integrante pelo slug' })
  @ApiParam({ name: 'slug', description: 'Slug do integrante' })
  @ApiResponse({
    status: 200,
    description: 'Integrante encontrado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Integrante não encontrado' })
  @ResponseMessage('Integrante encontrado')
  async findBySlug(@Param('slug') slug: string) {
    return this.teamMembersService.findBySlug(slug);
  }
}

@ApiTags('Integrantes (Admin)')
@ApiBearerAuth()
@Controller('admin/team-members')
export class TeamMembersAdminController {
  constructor(private readonly teamMembersService: TeamMembersService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar um integrante' })
  @ApiResponse({ status: 201, description: 'Integrante criado com sucesso' })
  @ResponseMessage('Integrante criado com sucesso')
  async create(@Body() dto: CreateTeamMemberDto) {
    return this.teamMembersService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um integrante' })
  @ApiParam({ name: 'id', description: 'ID do integrante', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Integrante atualizado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Integrante não encontrado' })
  @ResponseMessage('Integrante atualizado com sucesso')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTeamMemberDto,
  ) {
    return this.teamMembersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir um integrante' })
  @ApiParam({ name: 'id', description: 'ID do integrante', type: Number })
  @ApiResponse({ status: 200, description: 'Integrante excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Integrante não encontrado' })
  @ResponseMessage('Integrante excluído com sucesso')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.teamMembersService.remove(id);
    return null;
  }
}
