import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IAdminUserRepository } from '@/domain/repositories/admin-user.repository';

interface JwtPayload {
  sub: number;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(IAdminUserRepository)
    private readonly adminUserRepository: IAdminUserRepository,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: JwtPayload) {
    const admin = await this.adminUserRepository.findById(payload.sub);

    if (!admin) {
      throw new UnauthorizedException('Administrador não encontrado.');
    }

    return { id: admin.id, email: admin.email, name: admin.name };
  }
}
