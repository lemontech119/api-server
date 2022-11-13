import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/Entity/user.entity';
import { HttpService } from '@nestjs/axios';
import { v4 as uuid } from 'uuid';
import { JwtService } from '@nestjs/jwt/dist';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private httpService: HttpService,
  ) {}
  async login(code: string) {
    return await this.getUserByKakaoAccessToken(code);
  }

  async getUserByKakaoAccessToken(accessToken: string) {
    const url = 'https://kapi.kakao.com/v2/user/me';
    const headers = {
      Authorization: `bearer ${accessToken}`,
    };
    const auth = await this.httpService.axiosRef.get(url, { headers });

    const { id, properties } = auth.data;

    if (!auth) throw new UnauthorizedException('Kakao OAuth Exception.');
    const user = await this.userRepository.findOne({
      where: { userId: id },
    });
    if (!user) {
      const data = this.userRepository.create({
        id: uuid(),
        userId: Number(id),
        nickname: properties.nickname,
      });
      return await this.userRepository.save(data);
    }

    return user;
  }
  async getJwtAcessToken(user: User) {
    const payload = { user_id: user.userId };
    const accessToken = await this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.AUTH_EXPPIRESIN,
    });
    return {
      accessToken,
      accessOption: {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        maxAge: 1000 * 60 * 10,
      },
    };
  }
}
