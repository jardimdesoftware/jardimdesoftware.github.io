import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { TeamRole } from '@/domain/entities/team-member.entity';

export class FindTeamMemberDto {
  @ApiPropertyOptional({ enum: TeamRole, description: 'Filtrar por tipo' })
  @IsOptional()
  @IsEnum(TeamRole)
  role?: TeamRole;

  @ApiPropertyOptional({ description: 'Filtrar por ativos/inativos' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  active?: boolean;
}
