import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {
  handleRequest(err: Error, user: any, info: Error) {
    if (err || info || !user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
