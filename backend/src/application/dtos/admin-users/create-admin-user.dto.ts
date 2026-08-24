import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

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
}
