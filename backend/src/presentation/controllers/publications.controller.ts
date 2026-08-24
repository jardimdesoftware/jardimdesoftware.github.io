import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PublicationsService } from '@/application/services/publications/publications.service';
import { CreatePublicationDto } from '@/application/dtos/publications/create-publication.dto';
import { UpdatePublicationDto } from '@/application/dtos/publications/update-publication.dto';
import { Public } from '@/common/decorators/public.decorator';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';

@ApiTags('Publicações')
@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Listar publicações' })
  @ApiResponse({ status: 200, description: 'Publicações listadas com sucesso' })
  @ResponseMessage('Publicações listadas com sucesso')
  async findAll() {
    return this.publicationsService.findAll();
  }
}

@ApiTags('Publicações (Admin)')
@ApiBearerAuth()
@Controller('admin/publications')
export class PublicationsAdminController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar uma publicação' })
  @ApiResponse({ status: 201, description: 'Publicação criada com sucesso' })
  @ResponseMessage('Publicação criada com sucesso')
  async create(@Body() dto: CreatePublicationDto) {
    return this.publicationsService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar uma publicação' })
  @ApiParam({ name: 'id', description: 'ID da publicação', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Publicação atualizada com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Publicação não encontrada' })
  @ResponseMessage('Publicação atualizada com sucesso')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePublicationDto,
  ) {
    return this.publicationsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir uma publicação' })
  @ApiParam({ name: 'id', description: 'ID da publicação', type: Number })
  @ApiResponse({ status: 200, description: 'Publicação excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Publicação não encontrada' })
  @ResponseMessage('Publicação excluída com sucesso')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.publicationsService.remove(id);
    return null;
  }
}
