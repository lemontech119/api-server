import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { GetUser } from 'src/decorator/get-user.decorator';
import { GetUserDto } from './dto/getUser.dto';
import { LoginRequest } from './dto/loginRequest.dto';
import { AuthGuard } from './security/jwt.Guard';
import { JwtRefreshGuard } from './security/jwtRefresh.Guard';

@ApiTags('auth Api')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post()
  @ApiOperation({ summary: 'Login', description: 'Social login' })
  async login(
    @Body() data: LoginRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const {
      nickname,
      userId,
      accessToken,
      accessOption,
      refreshToken,
      refreshOption,
    } = await this.authService.login(data);
    res.cookie('Authentication', accessToken, accessOption);
    res.cookie('Refresh', refreshToken, refreshOption);

    return { nickname, userId };
  }
  @Get('logout')
  @ApiOperation({ summary: 'Logout', description: 'Logout' })
  @UseGuards(AuthGuard)
  async logout(
    @GetUser() getUserDto: GetUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.removeRefreshToken(getUserDto);
    const { accessOption, refreshOption } = this.authService.logout();
    res.cookie('Authentication', '', accessOption);
    res.cookie('Refresh', '', refreshOption);

    res.send();
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({
    summary: 'Referesh Token',
    description: 'Refresh Access Token',
  })
  @ApiCreatedResponse({
    description: 'New Access Token',
    type: GetUserDto,
  })
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
    @GetUser() getUserDto: GetUserDto,
  ) {
    const refreshToken: string = req.cookies?.Refresh;
    const { result } = await this.authService.getUserRefreshTokenMatches(
      refreshToken,
      getUserDto,
    );
    if (result) {
      const { accessToken, accessOption } =
        await this.authService.getJwtAcessToken(
          getUserDto.userId,
          getUserDto.nickname,
        );
      const { refreshToken, refreshOption } =
        await this.authService.getRefreshToekn(
          getUserDto.userId,
          getUserDto.nickname,
        );
      await this.authService.updateRefreshToken(
        refreshToken,
        getUserDto.userId,
      );
      res.cookie('Authentication', accessToken, accessOption);
      res.cookie('Refresh', refreshToken, refreshOption);
      return { nickname: getUserDto.nickname, userId: getUserDto.userId };
    } else {
      throw new UnauthorizedException();
    }
  }
}
