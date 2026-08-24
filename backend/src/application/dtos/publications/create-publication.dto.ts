import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { PublicationAuthorInputDto } from '@/application/dtos/publications/publication-author-input.dto';

export class CreatePublicationDto {
  @ApiProperty({ description: 'Título da publicação' })
  @IsString()
  @MaxLength(300)
  title!: string;

  @ApiPropertyOptional({ description: 'Veículo/local de publicação' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  venue?: string;

  @ApiProperty({ description: 'Ano da publicação' })
  @IsInt()
  year!: number;

  @ApiPropertyOptional({ description: 'Link para a publicação' })
  @IsOptional()
  @IsUrl()
  link?: string;

  @ApiPropertyOptional({ description: 'Ordem de exibição', default: 0 })
  @IsOptional()
  @IsInt()
  order?: number;

  @ApiPropertyOptional({
    type: [PublicationAuthorInputDto],
    description: 'Autores da publicação',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PublicationAuthorInputDto)
  authors?: PublicationAuthorInputDto[];
}
