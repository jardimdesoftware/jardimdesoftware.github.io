import {
  Injectable,
  Inject,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IAdminUserRepository } from '@/domain/repositories/admin-user.repository';
import { IHashService } from '@/application/ports/hash.service';
import { LoginDto } from '@/application/dtos/auth/login.dto';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

interface GoogleIdTokenPayload {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
}

export interface AuthenticatedAdmin {
  id: number;
  email: string;
  name: string;
}

export interface LoginResult {
  accessToken: string;
  user: AuthenticatedAdmin;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(IAdminUserRepository)
    private readonly adminUserRepository: IAdminUserRepository,
    @Inject(IHashService) private readonly hashService: IHashService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /** Monta a URL de consentimento do Google para a qual GET /auth/google redireciona. */
  getGoogleAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.configService.get<string>('GOOGLE_CLIENT_ID') ?? '',
      redirect_uri: this.configService.get<string>('GOOGLE_CALLBACK_URL') ?? '',
      response_type: 'code',
      scope: 'openid email profile',
      prompt: 'select_account',
    });
    return `${GOOGLE_AUTH_URL}?${params.toString()}`;
  }

  /**
   * Troca o `code` do callback do Google por um id_token e autentica.
   * O id_token vem direto do endpoint de token do Google (server-to-server,
   * via HTTPS), então decodificar o payload sem re-verificar a assinatura é
   * seguro aqui - não é um valor vindo do cliente.
   */
  async handleGoogleCallback(code: string): Promise<LoginResult> {
    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: this.configService.get<string>('GOOGLE_CLIENT_ID') ?? '',
        client_secret:
          this.configService.get<string>('GOOGLE_CLIENT_SECRET') ?? '',
        redirect_uri:
          this.configService.get<string>('GOOGLE_CALLBACK_URL') ?? '',
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      this.logger.warn(
        `Falha ao trocar code do Google por token: ${tokenResponse.status}`,
      );
      throw new UnauthorizedException('Não foi possível autenticar com o Google.');
    }

    const { id_token } = (await tokenResponse.json()) as { id_token: string };
    const payload = this.decodeGoogleIdToken(id_token);

    if (!payload.email_verified) {
      throw new UnauthorizedException('Email do Google não verificado.');
    }

    return this.loginWithGoogle({
      email: payload.email,
      name: payload.name,
      googleId: payload.sub,
    });
  }

  private decodeGoogleIdToken(idToken: string): GoogleIdTokenPayload {
    const payloadSegment = idToken.split('.')[1];
    const json = Buffer.from(payloadSegment, 'base64url').toString('utf8');
    return JSON.parse(json) as GoogleIdTokenPayload;
  }

  async login(loginDto: LoginDto): Promise<LoginResult> {
    const admin = await this.adminUserRepository.findByEmail(loginDto.email);

    if (
      !admin ||
      !admin.password ||
      !(await this.hashService.compare(loginDto.password, admin.password))
    ) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    return this.issueSession(admin);
  }

  /**
   * Login via Google: só entra quem já tem um AdminUser cadastrado com esse
   * email (ver AdminUsersController - a lista de acesso é gerenciada por lá).
   * Não cria conta nova sozinho a partir de um login do Google.
   */
  async loginWithGoogle(profile: {
    email: string;
    name?: string;
    googleId: string;
  }): Promise<LoginResult> {
    const admin = await this.adminUserRepository.findByEmail(profile.email);

    if (!admin) {
      throw new UnauthorizedException(
        'Este email não tem acesso ao painel administrativo.',
      );
    }

    const updated = await this.adminUserRepository.update(admin.id, {
      name: admin.name ?? profile.name,
      googleId: profile.googleId,
    });

    return this.issueSession(updated);
  }

  private async issueSession(admin: {
    id: number;
    email: string;
    name?: string | null;
  }): Promise<LoginResult> {
    await this.adminUserRepository.update(admin.id, { lastLogin: new Date() });

    const payload = { sub: admin.id, email: admin.email };
    const accessToken = this.jwtService.sign(payload);

    this.logger.log(`Administrador autenticado: ${admin.email}`);

    return {
      accessToken,
      user: { id: admin.id, email: admin.email, name: admin.name ?? admin.email },
    };
  }
}
