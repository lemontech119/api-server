import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuard extends NestAuthGuard('jwt') {
  handleRequest(err: Error, user: any) {
    if (err || !user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
