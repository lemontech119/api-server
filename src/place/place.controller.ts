import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { PlaceService } from './place.service';
import { PlaceInfoService } from './placeInfo.service';
import { AddPlace } from './dto/addPlace.dto';
import { Place } from './Entity/place.entity';
import { PlaceInfo } from './Entity/placeInfo.entity';
import { GetAllPlace } from './types/getAllPlace.type';
import { PlaceMiddleware } from './middlewares/place.mid';

@ApiTags('Place Api')
@Controller('place')
export class PlaceController {
  constructor(
    private readonly placeService: PlaceService,
    private readonly placeInfoService: PlaceInfoService,
    private readonly placeMiddleware: PlaceMiddleware,
  ) {}

  @Get('/exists/:kakaoId')
  @ApiOperation({
    summary: 'isExists',
    description: '장소가 저장되어 있는지 여부',
  })
  @ApiParam({
    name: 'kakaoId',
    required: true,
    description: '카카오 장소 id',
  })
  @ApiResponse({
    description: '장소 저장 여부',
    type: Boolean,
    status: 200,
  })
  async isExsitsKakaoPlace(@Param('kakaoId') kakaoId) {
    const isExists = await this.placeService.isExistsByKakaoId(kakaoId);

    return isExists;
  }

  @Post('/')
  @ApiOperation({ summary: 'Create', description: 'create place data' })
  @ApiResponse({
    status: 400,
    description: '이미 등록된 장소입니다.',
  })
  @ApiCreatedResponse({
    description: 'place',
    type: Place,
  })
  async add(@Body() addPlace: AddPlace) {
    const place = await this.placeService.createPlace(addPlace);

    return place;
  }

  @Get('/info/:id')
  @ApiOperation({ summary: 'GetPlaceInfo', description: '장소 상세 정보 조회' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'placeInfo id',
  })
  @ApiResponse({
    description: 'placeInfo',
    type: PlaceInfo,
  })
  async getPlaceInfoById(@Param('id') id) {
    const placeInfo = await this.placeInfoService.getPlaceInfoById(id);

    return placeInfo;
  }

  @Get('/all')
  @ApiOperation({ summary: 'GetPlaces', description: '모든 장소 목록 조회' })
  @ApiResponse({
    description: 'get all place',
    type: GetAllPlace,
    isArray: true,
  })
  async getAllPlace() {
    const places = await this.placeService.findAll();

    return places;
  }
}
