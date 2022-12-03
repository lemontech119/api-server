import { Body, Controller, Post } from '@nestjs/common';
import { PlaceService } from './place.service';
import { AddPlace } from './dto/addPlace.dto';

@Controller('place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Post('/')
  async add(@Body() addPlace: AddPlace) {
    const place = await this.placeService.createPlace(addPlace);

    return { place };
  }
}
