import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { RoleEnum } from '../enums/user.enum.js';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.user.role !== RoleEnum.ADMIN)
      throw new ForbiddenException('Admin access only');

    return true;
  }
}
