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
    const userId = await this.getUserByKakaoAccessToken(code);

    const accessToken = await this.getJwtAcessToken(Number(userId));

    return accessToken;
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

    return user.userId;
  }
  async getJwtAcessToken(userId: number) {
    const payload = { userId };
    const accessToken = await this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'test',
      expiresIn: process.env.AUTH_EXPPIRESIN || '10m',
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
