import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
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
import { GetPlaceDetail } from './types/getPlaceDetail.type';
import { GetPlaceSearch } from './types/getPlaceSearch.type';

@ApiTags('Place Api')
@Controller('place')
export class PlaceController {
  constructor(
    private readonly placeService: PlaceService,
    private readonly placeInfoService: PlaceInfoService,
  ) {}

  @Get('/keyword')
  async KeywwordSearch() {
    return await this.placeService.placeKeywordSearch();
  }

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
  async isExsitsKakaoPlace(@Param('kakaoId') kakaoId: string) {
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

  @Get('/:kakaoId')
  async findByKakaoId(@Param('kakaoId') kakaoId: string) {
    const isExists = await this.placeService.isExistsByKakaoId(kakaoId);

    if (!isExists) throw new NotFoundException('Can not find Place');

    const place = await this.placeService.kakaoIdByPlace(kakaoId);

    return await this.placeService.findByIdForSearch(place.id);
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
  async getPlaceInfoById(@Param('id') id: string) {
    const placeInfo = await this.placeInfoService.getPlaceInfoById(id);

    return placeInfo;
  }

  @Get('/reviewed')
  @ApiOperation({
    summary: 'GetPlaces',
    description: '리뷰가 작성된 장소 목록 조회',
  })
  @ApiResponse({
    description: 'get all place',
    type: GetAllPlace,
    isArray: true,
  })
  async getAllPlace() {
    const places = await this.placeService.findAll();

    return places;
  }

  @Get('/detail/:id')
  @ApiOperation({
    summary: 'Get Place Details',
    description: '장소 상세 정보',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
  })
  @ApiResponse({
    description: 'Get Place Details',
    type: GetPlaceDetail,
  })
  async getPlaceDetailsByKakaoID(
    @Param('id') id: string,
  ): Promise<GetPlaceDetail> {
    const place = await this.placeService.isExistsById(id);
    if (!place) return;

    return await this.placeService.findPlaceDetail(id);
  }

  @Get('/search/:kakaoId')
  @ApiOperation({
    summary: 'Get Place Search',
    description: '장소 검색 기본 정보',
  })
  @ApiParam({
    name: 'kakaoId',
    required: true,
    type: String,
  })
  @ApiResponse({
    description: 'Get Place Search Data',
    type: GetPlaceSearch,
  })
  async getPlaceSearchByKakaId(
    @Param('kakaoId') kakaoId: string,
  ): Promise<GetPlaceSearch> {
    const place = await this.placeService.kakaoIdByPlace(kakaoId);
    if (!place) return;
    const result = await this.placeService.findByIdForSearch(place.id);

    return result;
  }
}
