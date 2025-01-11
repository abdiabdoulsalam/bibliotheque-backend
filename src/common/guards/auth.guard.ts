import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtConfigService } from '~/jwt/jwt.service';
import { UsersService } from '~/users/users.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { RequestWithUser } from '../types/extended-interfaces';
import { UserEntity } from '~/users/entities/user.entity';
import { errors } from '../util/error-messages';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtConfigService: JwtConfigService,
    private readonly userService: UsersService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const mobileCookie = request.headers['user'];
    let currentLoggedInUser: UserEntity;

    if (mobileCookie) {
      currentLoggedInUser = await this.handleVerification(mobileCookie as string);
    } else {
      const cookie = request.cookies['user'] as string;
      if (!cookie) throw new UnauthorizedException(errors.user.unauthorized_action);
      currentLoggedInUser = await this.handleVerification(cookie);
    }

    request.user = currentLoggedInUser;
    return true;
  }

  private async handleVerification(token: string) {
    try {
      const payload = await this.jwtConfigService.verifyAsync(token);
      const user = await this.userService.findOne(payload.id);
      if (!user) throw new UnauthorizedException(errors.user.unauthorized_action);
      return user;
    } catch (e) {
      throw new UnauthorizedException(errors.session.jwt);
    }
  }
}
