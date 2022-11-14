import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { User } from '../Entity/user.entity';
import { Repository } from 'typeorm';
import { GetUserDto } from './../dto/getUser.dto';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private authService: AuthService,
  ) {
    super({
      secretOrKey: process.env.JWT_REFRESH_SECRET || 'refresh',
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const { userId, nickname } = payload;
    const refreshToken = req.cookies?.Refresh;
    const getUserDto: GetUserDto = {
      userId,
      nickname,
    };
    await this.authService.getUserRefreshTokenMatches(refreshToken, getUserDto);
    const user: User = await this.userRepository.findOne({
      where: { userId },
      select: { userId: true, nickname: true },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
