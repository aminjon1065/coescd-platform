import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '../../auth/interfaces/auth-user.interface';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthUser => {
    const request: Request = ctx.switchToHttp().getRequest();
    return request.user as AuthUser;
  },
);
