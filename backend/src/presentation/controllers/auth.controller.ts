import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
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
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

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

  @Get('google')
  @Public()
  @ApiOperation({ summary: 'Iniciar login com Google (redireciona)' })
  async googleStart(@Res() res: Response) {
    res.redirect(this.authService.getGoogleAuthUrl());
  }

  @Get('google/callback')
  @Public()
  @ApiOperation({ summary: 'Callback do OAuth do Google' })
  async googleCallback(@Query('code') code: string, @Res() res: Response) {
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') ??
      'http://localhost:3002';

    try {
      const { accessToken } = await this.authService.handleGoogleCallback(
        code,
      );
      res.redirect(
        `${frontendUrl}/admin/google-callback?token=${encodeURIComponent(accessToken)}`,
      );
    } catch {
      res.redirect(
        `${frontendUrl}/admin/login?error=${encodeURIComponent('Este email não tem acesso ao painel administrativo.')}`,
      );
    }
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
