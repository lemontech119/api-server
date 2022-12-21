import { Controller } from '@nestjs/common';
import { PlaceStatsService } from './place_stats.service';

@Controller('place-mood')
export class PlaceStatsController {
  constructor(private readonly placeStatsService: PlaceStatsService) {}
}
