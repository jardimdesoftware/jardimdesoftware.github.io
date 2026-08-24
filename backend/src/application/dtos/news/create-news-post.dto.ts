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

export class CreateNewsPostDto {
  @ApiProperty({
    description: 'Slug único da notícia',
    example: 'hackathon-2026',
  })
  @IsString()
  @MaxLength(160)
  slug!: string;

  @ApiProperty({ description: 'Título da notícia' })
  @IsString()
  @MaxLength(200)
  title!: string;

  @ApiProperty({ description: 'Resumo curto da notícia' })
  @IsString()
  @MinLength(1)
  excerpt!: string;

  @ApiProperty({ description: 'Conteúdo completo da notícia' })
  @IsString()
  @MinLength(1)
  body!: string;

  @ApiPropertyOptional({ description: 'URL da imagem de capa' })
  @IsOptional()
  @IsUrl({ require_tld: false })
  coverImageUrl?: string;

  @ApiPropertyOptional({
    description: 'Se a notícia está publicada',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @ApiPropertyOptional({ description: 'ID do integrante autor da notícia' })
  @IsOptional()
  @IsInt()
  authorId?: number;
}
