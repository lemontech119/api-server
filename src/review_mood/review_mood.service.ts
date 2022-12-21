import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { ReviewMood } from './Entity/review_mood.entity';
import { PlaceReview } from 'src/place_review/Entity/place_review.entity';
import { Place } from '../place/Entity/place.entity';
import { generateUuid } from '../utils/gnerator';
@Injectable()
export class ReviewMoodService {
  constructor(
    @InjectRepository(ReviewMood)
    private readonly placeMoodRepository: Repository<ReviewMood>,
  ) {}
  async createPlaceMood(
    placeReview: PlaceReview,
    place: Place,
    mood: string,
    queryRunnerManager: EntityManager,
  ) {
    const reviewMood = new ReviewMood();
    reviewMood.id = generateUuid();
    reviewMood.place = place;
    reviewMood.place_review = placeReview;
    reviewMood.mood = mood;
    try {
      return await queryRunnerManager.save(reviewMood);
    } catch (err) {
      throw new ConflictException('Failed to Transaction');
    }
  }
}
