import { CanActivate, ExecutionContext, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EUserRole } from '../../user/models/user-role.enum';
import { User } from '../../user/models/user.model';

@Inject()
export class RolesGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {

  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this._reflector.get<EUserRole[]>('roles', context.getHandler());

    if (!roles || roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: InstanceType<User> = request.user;

    const hasRole = () => roles.indexOf(user.role) >= 0;

    if (user && user.role && hasRole()) {
      return true;
    }

    throw new HttpException('You do not have enough permission', HttpStatus.UNAUTHORIZED);
  }
}
