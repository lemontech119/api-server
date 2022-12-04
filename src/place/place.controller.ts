import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { PlaceService } from './place.service';
import { PlaceInfoService } from './placeInfo.service';
import { AddPlace } from './dto/addPlace.dto';
import { Place } from './Entity/place.entity';
import { PlaceInfo } from './Entity/placeInfo.entity';

@ApiTags('Place Api')
@Controller('place')
export class PlaceController {
  constructor(
    private readonly placeService: PlaceService,
    private readonly placeInfoService: PlaceInfoService,
  ) {}

  @Post('/')
  @ApiOperation({ summary: 'Create', description: 'create place data' })
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
  @ApiCreatedResponse({
    description: 'placeInfo',
    type: PlaceInfo,
  })
  async getPlaceInfoById(@Param('id') id) {
    const placeInfo = await this.placeInfoService.getPlaceInfoById(id);

    return placeInfo;
  }
}
