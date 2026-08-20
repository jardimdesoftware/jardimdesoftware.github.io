import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '@/application/services/auth/auth.service';
import { LoginDto } from '@/application/dtos/auth/login.dto';
import { Public } from '@/common/decorators/public.decorator';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';
import { GetUser } from '@/common/decorators/get-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realizar login do administrador' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso. Retorna um token JWT.',
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  @ResponseMessage('Login realizado com sucesso')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter dados do administrador autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Dados do administrador autenticado.',
  })
  @ApiResponse({ status: 401, description: 'Não autenticado.' })
  @ResponseMessage('Administrador autenticado')
  async me(@GetUser() user: { id: number; email: string; name: string }) {
    return user;
  }
}
