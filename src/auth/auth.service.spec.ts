import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from '../database/typeorm.config';
import { AuthService } from './auth.service';
import { User } from './Entity/user.entity';
import { JwtStrategy } from './strategy/jwt.Strategy';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({}),
        TypeOrmModule.forFeature([User]),
        HttpModule.register({
          timeout: 5000,
          maxRedirects: 5,
        }),
      ],
      providers: [AuthService, JwtStrategy],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('get JWT', async () => {
    const testUserId = 1234567890;
    const result = await service.getJwtAcessToken(testUserId);
    expect(typeof result.accessToken).toBe('string');
  });
});
