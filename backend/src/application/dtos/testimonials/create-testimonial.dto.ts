import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTestimonialDto {
  @ApiProperty({ description: 'Depoimento' })
  @IsString()
  @MinLength(1)
  quote!: string;

  @ApiProperty({ description: 'Nome do autor do depoimento' })
  @IsString()
  @MaxLength(200)
  authorName!: string;

  @ApiPropertyOptional({ description: 'Papel/cargo do autor' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  authorRoleLabel?: string;

  @ApiPropertyOptional({ description: 'URL da foto do autor' })
  @IsOptional()
  @IsUrl({ require_tld: false })
  authorPhotoUrl?: string;

  @ApiPropertyOptional({ description: 'ID do integrante relacionado' })
  @IsOptional()
  @IsInt()
  teamMemberId?: number;

  @ApiPropertyOptional({ description: 'ID do projeto relacionado' })
  @IsOptional()
  @IsInt()
  projectId?: number;

  @ApiPropertyOptional({
    description: 'Se o depoimento é destaque',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({ description: 'Ordem de exibição', default: 0 })
  @IsOptional()
  @IsInt()
  order?: number;
}
