import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email do administrador',
    example: 'admin@jardimdesoftware.local',
  })
  @IsEmail()
  @MaxLength(254, { message: 'O email deve ter no máximo 254 caracteres.' })
  email!: string;

  @ApiProperty({
    description: 'Senha do administrador',
    example: 'ChangeMe123!',
  })
  @IsString()
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
  @MaxLength(72, { message: 'A senha deve ter no máximo 72 caracteres.' })
  password!: string;
}
