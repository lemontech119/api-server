import { Controller } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceInfoService } from './place_info.service';

@Controller('place')
export class PlaceController {
  constructor(
    private readonly placeService: PlaceService,
    private readonly placeInfoService: PlaceInfoService,
  ) {}
}
