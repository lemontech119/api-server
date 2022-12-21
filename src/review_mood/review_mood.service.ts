import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { ReviewMood } from './Entity/review_mood.entity';
import { PlaceReview } from 'src/place_review/Entity/place_review.entity';
import { Place } from '../place/Entity/place.entity';
import { generateUuid } from '../utils/gnerator';
import { ReviewMoodDto } from './dto/review_mood.dto';
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
    reviewMoodDto: ReviewMoodDto,
    queryRunnerManager: EntityManager,
  ) {
    const reviewMood = new ReviewMood();
    reviewMood.id = generateUuid();
    reviewMood.place = place;
    reviewMood.place_review = placeReview;
    reviewMood.mood_category =
      ReviewCategoryMoodEnum[reviewMoodDto.mood_category];
    reviewMood.mood = MoodEnum[reviewMoodDto.mood];
    try {
      return await queryRunnerManager.save(reviewMood);
    } catch (err) {
      throw new ConflictException(
        `${err}. Create Review Mood Failed to Transaction`,
      );
    }
  }

  async findMostValue(
    reviewId: string,
    placeId: string,
    queryRunnerManager: EntityManager,
  ) {
    try {
      const qb = await queryRunnerManager
        .createQueryBuilder(ReviewMood, 'reviewMood')
        .select('*')
        .from((sub) => {
          return sub
            .select('sub.placeId', 'sub.mood_category, sub.mood')
            .addSelect('count(sub.mood)', 'cnt')
            .from(ReviewMood, 'sub')
            .groupBy('sub.mood_category')
            .addGroupBy('sub.mood')
            .having('sub.placeId = 9bd838fc-8991-48a2-b1f1-9deedaf46f56');
        }, 'subQuery');
      // .innerJoin(
      //   (innerSub) => {
      //     return innerSub
      //       .select('c.mood_category')
      //       .addSelect('max(c.cnt)', 'max')
      //       .from((sub) => {
      //         return sub
      //           .select('c.placeId', 'c.mood_category, c.mood')
      //           .addSelect('count(reviewMood.mood)', 'cnt')
      //           .from(ReviewMood, 'c')
      //           .groupBy('c.mood_category')
      //           .addGroupBy('c.mood')
      //           .having('c.placeId = 9bd838fc-8991-48a2-b1f1-9deedaf46f56');
      //       }, 'c')
      //       .groupBy('c.mood_category');
      //   },
      //   'a',
      //   'a.cnt',
      //   'b.max',
      // );
      console.log(qb.getMany(), '######');
    } catch (err) {
      console.log(err);
    }
  }
}
