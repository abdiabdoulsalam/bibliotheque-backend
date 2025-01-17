import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

import { RequestWithUser } from '../types/extended-interfaces';
import { ROLE } from '../enums/role.enum';
import { errors } from '../util/error-messages';

@Injectable()
export class VerifyAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest<RequestWithUser>();

    if (user?.role !== ROLE.ADMIN) throw new ForbiddenException(errors.user.unauthorized_action);
    if (!user?.active) throw new ForbiddenException(errors.user.unauthorized_action);

    return true;
  }
}

@Injectable()
export class VerifyUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user, path } = context.switchToHttp().getRequest<RequestWithUser>();

    if (user?.role !== ROLE.USER) throw new ForbiddenException(errors.user.unauthorized_action);
    if (!user?.active) throw new ForbiddenException(errors.user.unauthorized_action);

    return true;
  }
}

@Injectable()
export class VerifyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user, path } = context.switchToHttp().getRequest<RequestWithUser>();
    if (!user?.active) throw new ForbiddenException(errors.user.unauthorized_action);
    return true;
  }
}
