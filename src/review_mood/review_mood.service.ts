import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { ReviewMood } from './Entity/review_mood.entity';
import { PlaceReview } from 'src/place_review/Entity/place_review.entity';
import { Place } from '../place/Entity/place.entity';
import { generateUuid } from '../utils/gnerator';
import { ReviewMoodDto } from './dto/review_mood.dto';
import { MoodEnum, ReviewCategoryMoodEnum } from './review_mood.enum';
import { MostReviewValue } from './dto/most_review_value.dto';

@Injectable()
export class ReviewMoodService {
  constructor(
    @InjectRepository(ReviewMood)
    private readonly placeMoodRepository: Repository<ReviewMood>,
  ) {}

  async createPlaceMood(
    placeReview: PlaceReview,
    place: Place,
    reviewMoodDto: ReviewMoodDto,
    queryRunnerManager: EntityManager,
  ): Promise<void> {
    const reviewMood = new ReviewMood();
    reviewMood.id = generateUuid();
    reviewMood.place = place;
    reviewMood.place_review = placeReview;
    reviewMood.mood_category =
      ReviewCategoryMoodEnum[reviewMoodDto.mood_category];
    reviewMood.mood = MoodEnum[reviewMoodDto.mood];
    try {
      await queryRunnerManager.save(reviewMood);
    } catch (err) {
      throw new ConflictException(
        `${err}. Create Review Mood Failed to Transaction`,
      );
    }
  }

  async findMostValue(
    placeId: string,
    queryRunnerManager: EntityManager,
  ): Promise<MostReviewValue[]> {
    try {
      const query = queryRunnerManager.createQueryBuilder(
        ReviewMood,
        'reviewMood',
      );
      const qb1 = query
        .select([
          'place.id as placeId',
          'reviewMood.mood_category as mood_category',
          'reviewMood.mood as mood',
        ])
        .leftJoin('reviewMood.place', 'place')
        .addSelect('COUNT(reviewMood.mood) as cnt')
        .groupBy('reviewMood.mood_category')
        .addGroupBy('reviewMood.mood')
        .addGroupBy('place.id')
        .having('place.id = :placeId', { placeId });

      const qb2 = queryRunnerManager
        .createQueryBuilder()
        .select('subTable.mood_category as mood_category')
        .addSelect('MAX(subTable.cnt) as max')
        .from(`(${qb1.getQuery()})`, 'subTable')
        .setParameters(qb1.getParameters())
        .addGroupBy('subTable.mood_category');

      const mostReviewValue: MostReviewValue[] = await queryRunnerManager
        .createQueryBuilder()
        .select('t1.placeId, t1.mood_category, t1.mood, t1.cnt')
        .from(`(${qb1.getQuery()})`, 't1')
        .setParameters(qb1.getParameters())
        .innerJoin(
          `(${qb2.getQuery()})`,
          't2',
          't1.mood_category = t2.mood_category and t1.cnt = t2.max',
        )
        .getRawMany();

      return mostReviewValue;
    } catch (err) {
      throw new NotFoundException(
        `${err}. Select Most Review Value Failed to Transaction`,
      );
    }
  }
}
