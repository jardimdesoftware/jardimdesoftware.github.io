import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class ProjectMemberInputDto {
  @ApiProperty({ description: 'ID do integrante da equipe' })
  @IsInt()
  teamMemberId!: number;

  @ApiPropertyOptional({ description: 'Papel do integrante no projeto' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  roleLabel?: string;
}
