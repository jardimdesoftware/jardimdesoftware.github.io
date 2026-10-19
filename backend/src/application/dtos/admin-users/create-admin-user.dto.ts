import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Role } from '@/domain/entities/admin-user.entity';

export class CreateAdminUserDto {
  @ApiProperty({
    description: 'Email liberado para acessar o painel (via login Google)',
    example: 'novo.admin@gmail.com',
  })
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @ApiPropertyOptional({ description: 'Nome do administrador' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional({
    description: 'Papel do administrador (padrão: EDITOR)',
    enum: Object.values(Role),
    default: Role.EDITOR,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
