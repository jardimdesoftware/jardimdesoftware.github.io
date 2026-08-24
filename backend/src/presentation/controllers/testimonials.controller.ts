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
import { TestimonialsService } from '@/application/services/testimonials/testimonials.service';
import { CreateTestimonialDto } from '@/application/dtos/testimonials/create-testimonial.dto';
import { UpdateTestimonialDto } from '@/application/dtos/testimonials/update-testimonial.dto';
import { FindTestimonialDto } from '@/application/dtos/testimonials/find-testimonial.dto';
import { Public } from '@/common/decorators/public.decorator';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';

@ApiTags('Depoimentos')
@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Listar depoimentos' })
  @ApiResponse({ status: 200, description: 'Depoimentos listados com sucesso' })
  @ResponseMessage('Depoimentos listados com sucesso')
  async findAll(@Query() query: FindTestimonialDto) {
    return this.testimonialsService.findAll(query);
  }
}

@ApiTags('Depoimentos (Admin)')
@ApiBearerAuth()
@Controller('admin/testimonials')
export class TestimonialsAdminController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar um depoimento' })
  @ApiResponse({ status: 201, description: 'Depoimento criado com sucesso' })
  @ResponseMessage('Depoimento criado com sucesso')
  async create(@Body() dto: CreateTestimonialDto) {
    return this.testimonialsService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um depoimento' })
  @ApiParam({ name: 'id', description: 'ID do depoimento', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Depoimento atualizado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Depoimento não encontrado' })
  @ResponseMessage('Depoimento atualizado com sucesso')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTestimonialDto,
  ) {
    return this.testimonialsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir um depoimento' })
  @ApiParam({ name: 'id', description: 'ID do depoimento', type: Number })
  @ApiResponse({ status: 200, description: 'Depoimento excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Depoimento não encontrado' })
  @ResponseMessage('Depoimento excluído com sucesso')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.testimonialsService.remove(id);
    return null;
  }
}
