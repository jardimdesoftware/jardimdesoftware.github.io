import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ProjectStatus } from '@/domain/entities/project.entity';
import { ProjectMemberInputDto } from '@/application/dtos/projects/project-member-input.dto';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Slug único do projeto',
    example: 'sistema-de-estoque',
  })
  @IsString()
  @MaxLength(160)
  slug!: string;

  @ApiProperty({ description: 'Título do projeto' })
  @IsString()
  @MaxLength(200)
  title!: string;

  @ApiProperty({ description: 'Resumo curto do projeto' })
  @IsString()
  @MinLength(1)
  summary!: string;

  @ApiProperty({ description: 'Descrição completa do projeto' })
  @IsString()
  @MinLength(1)
  description!: string;

  @ApiPropertyOptional({
    enum: ProjectStatus,
    default: ProjectStatus.EM_DESENVOLVIMENTO,
  })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiPropertyOptional({ description: 'Categoria do projeto' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  category?: string;

  @ApiPropertyOptional({ description: 'URL do repositório' })
  @IsOptional()
  @IsUrl()
  repoUrl?: string;

  @ApiPropertyOptional({ description: 'URL de demonstração' })
  @IsOptional()
  @IsUrl()
  demoUrl?: string;

  @ApiPropertyOptional({ description: 'URL da imagem de capa' })
  @IsOptional()
  @IsUrl({ require_tld: false })
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Se o projeto é destaque',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({ description: 'Ordem de exibição', default: 0 })
  @IsOptional()
  @IsInt()
  order?: number;

  @ApiPropertyOptional({
    type: [ProjectMemberInputDto],
    description: 'Integrantes vinculados ao projeto',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectMemberInputDto)
  members?: ProjectMemberInputDto[];
}
