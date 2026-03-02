import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_ADMIN_KEY } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isAdminRequired = this.reflector.getAllAndOverride<boolean>(
      IS_ADMIN_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!isAdminRequired) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (user && user.is_admin) {
      return true;
    }

    throw new ForbiddenException({
      success: false,
      message: 'Access denied: Admin only',
    });
  }
}
