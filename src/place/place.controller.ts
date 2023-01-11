import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  NotFoundException,
  Query,
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
import * as qs from 'qs';
import { KeywordSearchDto } from './dto/keywordSearch.dto';
import {
  ReviewLightingEnum,
  ReviewMoodEnum,
  ReviewPraisedEnum,
} from 'src/review_mood/review_mood.enum';

@ApiTags('Place Api')
@Controller('place')
export class PlaceController {
  constructor(
    private readonly placeService: PlaceService,
    private readonly placeInfoService: PlaceInfoService,
  ) {}

  @ApiOperation({
    summary: 'Keyword Search',
    description: '키워드 검색',
  })
  @Get('/keyword')
  async KeywwordSearch(@Query('keyword') keyword: string) {
    /* 키워드 파싱 */
    const query = qs.parse(keyword, {
      decoder(value) {
        if (/^(\d+|\d*\.\d+)$/.test(value)) {
          return parseFloat(value);
        }

        const keywords = {
          true: true,
          false: false,
          null: null,
          undefined: undefined,
        };
        if (value in keywords) {
          return keywords[value];
        }

        return value;
      },
    });

    const { participants, price, mood, lighting, praised, etc } = query;

    /* 키워드 */
    const kyeword: KeywordSearchDto = {
      participants: {
        min: Number(participants['min']),
        max: Number(participants['max']),
      },
      price: price.toString(),
      praised: ReviewPraisedEnum[praised.toString()],
      lighting: ReviewLightingEnum[lighting.toString()],
      mood: ReviewMoodEnum[mood.toString()],
      etc: {
        is_cork_charge: etc['is_cork_charge'],
        is_rent: etc['is_rent'],
        is_room: etc['is_room'],
        is_reservation: etc['is_reservation'],
        is_parking: etc['is_parking'],
        is_advance_payment: etc['is_advance_payment'],
      },
    };
    return await this.placeService.placeKeywordSearch(kyeword);
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
