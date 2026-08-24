import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TeamRole } from '@/domain/entities/team-member.entity';

export class CreateTeamMemberDto {
  @ApiProperty({
    description: 'Slug único do integrante',
    example: 'joao-silva',
  })
  @IsString()
  @MaxLength(120)
  slug!: string;

  @ApiProperty({ description: 'Nome do integrante', example: 'João Silva' })
  @IsString()
  @MaxLength(200)
  name!: string;

  @ApiProperty({ enum: TeamRole, description: 'Tipo do integrante' })
  @IsEnum(TeamRole)
  roleType!: TeamRole;

  @ApiPropertyOptional({ description: 'Título/cargo do integrante' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  roleTitle?: string;

  @ApiProperty({ description: 'Biografia do integrante' })
  @IsString()
  @MinLength(1)
  bio!: string;

  @ApiPropertyOptional({ description: 'URL da foto do integrante' })
  @IsOptional()
  @IsUrl({ require_tld: false })
  photoUrl?: string;

  @ApiPropertyOptional({ description: 'Email do integrante' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'URL do LinkedIn' })
  @IsOptional()
  @IsUrl()
  linkedinUrl?: string;

  @ApiPropertyOptional({ description: 'URL do GitHub' })
  @IsOptional()
  @IsUrl()
  githubUrl?: string;

  @ApiPropertyOptional({
    description: 'Se o integrante está ativo',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({ description: 'Ordem de exibição', default: 0 })
  @IsOptional()
  @IsInt()
  order?: number;
}
