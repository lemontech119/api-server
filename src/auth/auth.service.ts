import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './Entity/user.entity';
import { HttpService } from '@nestjs/axios';
import { v4 as uuid } from 'uuid';
import { JwtService } from '@nestjs/jwt/dist';
import { GetUserDto } from './dto/getUser.dto';
import { LoginRequest } from './dto/loginRequest.dto';
import { NotAcceptableException } from '@nestjs/common/exceptions';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private httpService: HttpService,
  ) {}

  async login(data: LoginRequest) {
    let user: User;
    switch (data.vendor) {
      case 'kakao': {
        user = await this.getUserByKakaoAccessToken(data);
        break;
      }
      default: {
        throw new NotAcceptableException();
      }
    }

    const { accessToken, accessOption } = await this.getJwtAcessToken(
      user.userId,
      user.nickname,
    );

    const { refreshToken, refreshOption } = await this.getRefreshToekn(
      user.userId,
      user.nickname,
    );

    await this.updateRefreshToken(refreshToken, user.userId);

    return {
      userId: user.userId,
      nickname: user.nickname,
      accessToken,
      accessOption,
      refreshToken,
      refreshOption,
    };
  }

  async getUserByKakaoAccessToken(data: LoginRequest) {
    const { accessToken, vendor } = data;
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
        vendor,
      });
      return await this.userRepository.save(data);
    }

    return user;
  }
  async getJwtAcessToken(userId: number, nickname: string) {
    const payload = { userId, nickname };
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
  async getRefreshToekn(userId: number, nickname: string) {
    const payload = { userId, nickname };
    const refreshToken = await this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh',
      expiresIn: process.env.REFRESH_EXPPIRESIN || '1d',
    });
    return {
      refreshToken,
      refreshOption: {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      },
    };
  }

  async updateRefreshToken(refreshToken: string, userId: number) {
    await this.userRepository.update({ userId }, { refreshToken });
  }

  logout() {
    return {
      accessOption: {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        maxAge: 0,
      },
      refreshOption: {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        maxAge: 0,
      },
    };
  }

  async removeRefreshToken(getUserDto: GetUserDto) {
    const user = await this.userRepository.findOne({
      where: { nickname: getUserDto.nickname, userId: getUserDto.userId },
    });
    user.refreshToken = null;
    await this.userRepository.save(user);
  }

  async getUserRefreshTokenMatches(
    refreshToken: string,
    getUserDto: GetUserDto,
  ) {
    const user = await this.userRepository.findOne({
      where: { nickname: getUserDto.nickname, userId: getUserDto.userId },
    });
    if (!user) {
      throw new UnauthorizedException('Can not find user');
    }
    const isRefreshTokenMatch = refreshToken === user.refreshToken;

    if (isRefreshTokenMatch) {
      return { result: true };
    } else {
      throw new UnauthorizedException();
    }
  }
}
