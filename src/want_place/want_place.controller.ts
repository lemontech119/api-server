import { Controller } from '@nestjs/common';
import { WantPlaceService } from './want_place.service';

@Controller('want-place')
export class WantPlaceController {
  constructor(private readonly wantPlaceService: WantPlaceService) {}
}
