import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Users as UserEntity } from 'src/common/db/entities/user.entity';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserEntity;
  },
);
