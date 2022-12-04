import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlaceService } from './place.service';
import { AddPlace } from './dto/addPlace.dto';
import { Place } from './Entity/place.entity';

@ApiTags('Place Api')
@Controller('place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Post('/')
  @ApiOperation({ summary: 'Create', description: 'create place data' })
  @ApiCreatedResponse({
    description: 'place',
    type: Place,
  })
  async add(@Body() addPlace: AddPlace) {
    const place = await this.placeService.createPlace(addPlace);

    return { place };
  }
}
