import {
  Injectable,
  Inject,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAdminUserRepository } from '@/domain/repositories/admin-user.repository';
import { IHashService } from '@/application/ports/hash.service';
import { LoginDto } from '@/application/dtos/auth/login.dto';

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
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResult> {
    const admin = await this.adminUserRepository.findByEmail(loginDto.email);

    if (
      !admin ||
      !(await this.hashService.compare(loginDto.password, admin.password))
    ) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    await this.adminUserRepository.update(admin.id, { lastLogin: new Date() });

    const payload = { sub: admin.id, email: admin.email };
    const accessToken = this.jwtService.sign(payload);

    this.logger.log(`Administrador autenticado: ${admin.email}`);

    return {
      accessToken,
      user: { id: admin.id, email: admin.email, name: admin.name },
    };
  }
}
