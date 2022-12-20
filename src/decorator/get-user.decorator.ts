import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GetUserDto } from './../auth/dto/getUser.dto';
import { ParseUserPipe } from 'src/auth/pipe/parse-user.pipe';

/**
 * @UseGaurds(AuthGard) security 사용시에만 사용 가능
 */
export const GetUserDecorator = createParamDecorator(
  (data: string, ctx: ExecutionContext): GetUserDto => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
/**
 * Module에 AuthModule import 한 뒤 사용
 */
export const GetUser = (additionalOptions?: any) =>
  GetUserDecorator(additionalOptions, ParseUserPipe);
