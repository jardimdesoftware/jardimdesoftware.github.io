import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class PublicationAuthorInputDto {
  @ApiPropertyOptional({
    description: 'ID do integrante da equipe (autor interno)',
  })
  @IsOptional()
  @IsInt()
  teamMemberId?: number;

  @ApiPropertyOptional({
    description: 'Nome de autor externo (não integrante)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  externalName?: string;
}
