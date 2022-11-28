import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaceReview } from './Entity/place_review.entity';

@Injectable()
export class PlaceReviewService {
  constructor(
    @InjectRepository(PlaceReview)
    private readonly placeReviewRepository: Repository<PlaceReview>,
  ) {}
}
