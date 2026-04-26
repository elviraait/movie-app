import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

// Hierarchy: SUPER_ADMIN > ADMIN > USER
const ROLE_HIERARCHY: Record<Role, number> = {
  [Role.USER]: 0,
  [Role.ADMIN]: 1,
  [Role.SUPER_ADMIN]: 2,
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // No @Roles() decorator — allow access
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    const userLevel = ROLE_HIERARCHY[user?.role as Role] ?? -1;

    // User passes if their level is >= the minimum required role level
    const minRequired = Math.min(
      ...requiredRoles.map((r) => ROLE_HIERARCHY[r] ?? 99),
    );

    if (userLevel < minRequired) {
      throw new ForbiddenException(
        'У вас нет прав для доступа к этому ресурсу.',
      );
    }

    return true;
  }
}
