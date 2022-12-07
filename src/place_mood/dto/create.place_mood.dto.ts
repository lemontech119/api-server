import { IsString } from 'class-validator';

export class CreatePlaceMoodDto {
  @IsString()
  placeReviewId: string;

  @IsString()
  mood: string;
}
