import { Module } from '@nestjs/common';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategy/jwt.Strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/Entity/user.entity';
import { HttpModule } from '@nestjs/axios';
import { RefreshJwtStrategy } from './strategy/refresh.Strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    TypeOrmModule.forFeature([User]),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  exports: [AuthService, JwtStrategy],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshJwtStrategy],
})
export class AuthModule {}
