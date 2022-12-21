import { IsNotEmpty, IsString } from 'class-validator';
import { MoodEnum, ReviewCategoryMoodEnum } from '../review_mood.enum';

export class ReveiwMoodDto {
  @IsString()
  @IsNotEmpty()
  mood_category: ReviewCategoryMoodEnum;

  @IsString()
  @IsNotEmpty()
  mood: MoodEnum;
}
