import { Controller } from '@nestjs/common';
import { PlaceReviewService } from './place_review.service';

@Controller('place-review')
export class PlaceReviewController {
  constructor(private readonly placeReviewService: PlaceReviewService) {}
}
