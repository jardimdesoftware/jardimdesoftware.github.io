import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator';
import { ROLES_KEY } from '@/common/decorators/roles.decorator';
import { Role } from '@/domain/entities/admin-user.entity';

/**
 * Roda depois do JwtAuthGuard (ver ordem dos APP_GUARD no AppModule), então
 * `request.user.role` já vem do banco. Rotas sem @Roles mantêm o
 * comportamento anterior: qualquer usuário autenticado passa.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const targets = [context.getHandler(), context.getClass()];

    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      targets,
    );
    if (isPublic) {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<Role[] | undefined>(
      ROLES_KEY,
      targets,
    );
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<{
      user?: { role?: Role };
    }>();

    if (!user?.role || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Você não tem permissão para esta ação.');
    }

    return true;
  }
}
