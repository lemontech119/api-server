import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GetUserDto } from './../auth/dto/getUser.dto';

/**
 * @UseGaurds(AuthGard) security 사용시에만 사용 가능
 */
export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext): GetUserDto => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
