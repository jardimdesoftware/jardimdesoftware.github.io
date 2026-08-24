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
import { NewsService } from '@/application/services/news/news.service';
import { CreateNewsPostDto } from '@/application/dtos/news/create-news-post.dto';
import { UpdateNewsPostDto } from '@/application/dtos/news/update-news-post.dto';
import { FindNewsPostDto } from '@/application/dtos/news/find-news-post.dto';
import { Public } from '@/common/decorators/public.decorator';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';

@ApiTags('Notícias')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Listar notícias publicadas' })
  @ApiResponse({ status: 200, description: 'Notícias listadas com sucesso' })
  @ResponseMessage('Notícias listadas com sucesso')
  async findPublished(@Query() query: FindNewsPostDto) {
    return this.newsService.findPublished(query);
  }

  @Get(':slug')
  @Public()
  @ApiOperation({ summary: 'Buscar uma notícia publicada pelo slug' })
  @ApiParam({ name: 'slug', description: 'Slug da notícia' })
  @ApiResponse({ status: 200, description: 'Notícia encontrada com sucesso' })
  @ApiResponse({ status: 404, description: 'Notícia não encontrada' })
  @ResponseMessage('Notícia encontrada')
  async findBySlug(@Param('slug') slug: string) {
    return this.newsService.findBySlugPublished(slug);
  }
}

@ApiTags('Notícias (Admin)')
@ApiBearerAuth()
@Controller('admin/news')
export class NewsAdminController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as notícias, incluindo rascunhos' })
  @ApiResponse({ status: 200, description: 'Notícias listadas com sucesso' })
  @ResponseMessage('Notícias listadas com sucesso')
  async findAll() {
    return this.newsService.findAllAdmin();
  }

  @Post()
  @ApiOperation({ summary: 'Cadastrar uma notícia' })
  @ApiResponse({ status: 201, description: 'Notícia criada com sucesso' })
  @ResponseMessage('Notícia criada com sucesso')
  async create(@Body() dto: CreateNewsPostDto) {
    return this.newsService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar uma notícia' })
  @ApiParam({ name: 'id', description: 'ID da notícia', type: Number })
  @ApiResponse({ status: 200, description: 'Notícia atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Notícia não encontrada' })
  @ResponseMessage('Notícia atualizada com sucesso')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNewsPostDto,
  ) {
    return this.newsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir uma notícia' })
  @ApiParam({ name: 'id', description: 'ID da notícia', type: Number })
  @ApiResponse({ status: 200, description: 'Notícia excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Notícia não encontrada' })
  @ResponseMessage('Notícia excluída com sucesso')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.newsService.remove(id);
    return null;
  }
}
