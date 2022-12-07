import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/auth/Entity/user.entity';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'test',
      passReqToCallback: true,
    });
  }

  async validate(payload: any) {
    const { nickname, userId } = payload;
    const user: User = await this.userRepository.findOne({
      where: { userId, nickname },
      select: { userId: true, nickname: true },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
