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
import { ProjectsService } from '@/application/services/projects/projects.service';
import { CreateProjectDto } from '@/application/dtos/projects/create-project.dto';
import { UpdateProjectDto } from '@/application/dtos/projects/update-project.dto';
import { FindProjectDto } from '@/application/dtos/projects/find-project.dto';
import { Public } from '@/common/decorators/public.decorator';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';

@ApiTags('Projetos')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Listar projetos' })
  @ApiResponse({ status: 200, description: 'Projetos listados com sucesso' })
  @ResponseMessage('Projetos listados com sucesso')
  async findAll(@Query() query: FindProjectDto) {
    return this.projectsService.findAll(query);
  }

  @Get(':slug')
  @Public()
  @ApiOperation({ summary: 'Buscar um projeto pelo slug' })
  @ApiParam({ name: 'slug', description: 'Slug do projeto' })
  @ApiResponse({ status: 200, description: 'Projeto encontrado com sucesso' })
  @ApiResponse({ status: 404, description: 'Projeto não encontrado' })
  @ResponseMessage('Projeto encontrado')
  async findBySlug(@Param('slug') slug: string) {
    return this.projectsService.findBySlug(slug);
  }
}

@ApiTags('Projetos (Admin)')
@ApiBearerAuth()
@Controller('admin/projects')
export class ProjectsAdminController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar um projeto' })
  @ApiResponse({ status: 201, description: 'Projeto criado com sucesso' })
  @ResponseMessage('Projeto criado com sucesso')
  async create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um projeto' })
  @ApiParam({ name: 'id', description: 'ID do projeto', type: Number })
  @ApiResponse({ status: 200, description: 'Projeto atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Projeto não encontrado' })
  @ResponseMessage('Projeto atualizado com sucesso')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir um projeto' })
  @ApiParam({ name: 'id', description: 'ID do projeto', type: Number })
  @ApiResponse({ status: 200, description: 'Projeto excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Projeto não encontrado' })
  @ResponseMessage('Projeto excluído com sucesso')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.projectsService.remove(id);
    return null;
  }
}
