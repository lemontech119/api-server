import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { ReviewMood } from './Entity/review_mood.entity';
import { PlaceReview } from 'src/place_review/Entity/place_review.entity';
import { Place } from '../place/Entity/place.entity';
import { generateUuid } from '../utils/gnerator';
import { ReveiwMoodDto } from './dto/review_mood.dto';
import { MoodEnum, ReviewCategoryMoodEnum } from './review_mood.enum';

@Injectable()
export class ReviewMoodService {
  constructor(
    @InjectRepository(ReviewMood)
    private readonly placeMoodRepository: Repository<ReviewMood>,
  ) {}
  async createPlaceMood(
    placeReview: PlaceReview,
    place: Place,
    reveiwMoodDto: ReveiwMoodDto,
    queryRunnerManager: EntityManager,
  ) {
    console.log(
      reveiwMoodDto,
      reveiwMoodDto.mood,
      reveiwMoodDto.mood_category,
      ReviewCategoryMoodEnum[reveiwMoodDto.mood_category],
    );
    const reviewMood = new ReviewMood();
    reviewMood.id = generateUuid();
    reviewMood.place = place;
    reviewMood.place_review = placeReview;
    reviewMood.mood_category =
      ReviewCategoryMoodEnum[reveiwMoodDto.mood_category];
    reviewMood.mood = MoodEnum[reveiwMoodDto.mood];
    try {
      return await queryRunnerManager.save(reviewMood);
    } catch (err) {
      throw new ConflictException(
        err + 'Create Review Mood Failed to Transaction',
      );
    }
  }
}
