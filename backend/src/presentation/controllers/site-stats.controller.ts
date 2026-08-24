import { Body, Controller, Get, ParseArrayPipe, Put } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SiteStatsService } from '@/application/services/site-stats/site-stats.service';
import { SiteStatItemDto } from '@/application/dtos/site-stats/site-stat-item.dto';
import { Public } from '@/common/decorators/public.decorator';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';

@ApiTags('Estatísticas do site')
@Controller('site-stats')
export class SiteStatsController {
  constructor(private readonly siteStatsService: SiteStatsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Listar estatísticas do site' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas listadas com sucesso',
  })
  @ResponseMessage('Estatísticas listadas com sucesso')
  async findAll() {
    return this.siteStatsService.findAll();
  }
}

@ApiTags('Estatísticas do site (Admin)')
@ApiBearerAuth()
@Controller('admin/site-stats')
export class SiteStatsAdminController {
  constructor(private readonly siteStatsService: SiteStatsService) {}

  @Put()
  @ApiOperation({
    summary:
      'Substituir o conjunto de estatísticas do site (upsert em massa). ' +
      'Itens sem "id" são criados; itens com "id" são atualizados; ' +
      'estatísticas existentes cujo "id" não estiver no array são removidas.',
  })
  @ApiBody({ type: [SiteStatItemDto] })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas atualizadas com sucesso',
  })
  @ResponseMessage('Estatísticas atualizadas com sucesso')
  async replaceAll(
    @Body(new ParseArrayPipe({ items: SiteStatItemDto }))
    stats: SiteStatItemDto[],
  ) {
    return this.siteStatsService.replaceAll(stats);
  }
}
