import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { MoodEnum, ReviewCategoryMoodEnum } from '../review_mood.enum';

export class MostReviewValue {
  @IsNotEmpty()
  @IsString()
  placeId: string;

  @IsNotEmpty()
  @IsString()
  mood_category: ReviewCategoryMoodEnum;

  @IsNotEmpty()
  @IsString()
  mood: MoodEnum;

  @IsNotEmpty()
  @IsNumber()
  cnt: number;
}
