import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class SiteStatItemDto {
  @ApiPropertyOptional({
    description:
      'ID da estatística existente (omitir para criar uma nova). Estatísticas cujo ID não aparecer no array enviado serão removidas.',
  })
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiProperty({ description: 'Rótulo da estatística', example: 'PROJETOS' })
  @IsString()
  @MaxLength(120)
  label!: string;

  @ApiProperty({ description: 'Valor exibido da estatística', example: '12+' })
  @IsString()
  @MaxLength(60)
  value!: string;

  @ApiPropertyOptional({ description: 'Ordem de exibição', default: 0 })
  @IsOptional()
  @IsInt()
  order?: number;
}
