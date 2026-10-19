import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Role } from '@/domain/entities/admin-user.entity';

export class UpdateAdminUserRoleDto {
  @ApiProperty({
    description: 'Novo papel do administrador',
    enum: Object.values(Role),
    example: Role.EDITOR,
  })
  @IsEnum(Role)
  role!: Role;
}
