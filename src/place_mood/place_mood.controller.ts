import { Controller } from '@nestjs/common';
import { PlaceMoodService } from './place_mood.service';

@Controller('place-mood')
export class PlaceMoodController {
  constructor(private readonly placeMoodService: PlaceMoodService) {}
}
