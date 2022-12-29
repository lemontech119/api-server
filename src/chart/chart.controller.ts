import { Controller, Get, Param } from '@nestjs/common';
import { PlaceService } from 'src/place/place.service';
import { ChartService } from './chart.service';

@Controller('chart')
export class ChartController {
  constructor(
    private readonly chartService: ChartService,
    private readonly placeService: PlaceService,
  ) {}

  @Get('/:chartName')
  async getChartByName(@Param('chartName') chartName) {
    const placeIdList = await this.chartService.findPlaceIdListByName(
      chartName,
    );

    if (placeIdList.length === 0) {
      return [];
    }

    const places = await this.placeService.findByIdList(placeIdList);

    return places;
  }
}
