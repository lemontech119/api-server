import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  ReviewLightingEnum,
  ReviewMoodEnum,
  ReviewPraisedEnum,
} from 'src/review_mood/review_mood.enum';

export class KeywwordSearchDto {
  @IsNumber()
  @IsOptional()
  participants: number;

  @IsString()
  @IsOptional()
  price: string;

  @IsString()
  @IsOptional()
  mood: ReviewMoodEnum;

  @IsString()
  @IsOptional()
  lighting: ReviewLightingEnum;

  @IsString()
  @IsOptional()
  praised: ReviewPraisedEnum;

  @IsBoolean()
  is_cork_charge: boolean = false;

  @IsBoolean()
  is_rent: boolean = false;

  @IsBoolean()
  is_room: boolean = false;

  @IsBoolean()
  is_reservation: boolean = false;

  @IsBoolean()
  is_parking: boolean = false;

  @IsBoolean()
  is_advance_payment: boolean = false;
}
