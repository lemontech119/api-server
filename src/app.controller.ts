import { Controller, Get, Version } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
@ApiTags('테스트 API')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Version('1')
  @Get()
  @ApiOperation({ summary: '서버 확인용 API', description: '확인용입니다.' })
  @ApiResponse({ description: 'Hello API Version 1' })
  getHello(): string {
    return this.appService.getHello();
  }
}
