import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { ERROR_CODES } from '../../../../libs/utils/src';
import { PERMISSION_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const { user } = context?.switchToHttp()?.getRequest() || GqlExecutionContext.create(context).getContext().req;

    const userPermissions = user?.role?.permissions?.map((permission) => permission.value);

    const isValidPermissions = requiredPermissions.some((permission) => userPermissions?.includes(permission));

    if (!isValidPermissions) {
      throw new ForbiddenException(ERROR_CODES.err_forbidden_resource);
    }

    return isValidPermissions;
    //return true;
  }
}
