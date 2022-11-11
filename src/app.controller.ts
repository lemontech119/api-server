import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
@ApiTags('테스트 API')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: '서버 확인용 API', description: '확인용입니다.' })
  @ApiResponse({ description: 'Hello World!' })
  getHello(): string {
    return this.appService.getHello();
  }
}
