import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GetUserDto } from './../auth/dto/getUser.dto';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext): GetUserDto => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
