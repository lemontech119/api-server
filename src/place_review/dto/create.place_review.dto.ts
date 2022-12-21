import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';
import {
  MoodEnum,
  ReviewCategoryMoodEnum,
} from 'src/review_mood/review_mood.enum';
import { ReviewMoodDto } from '../../review_mood/dto/review_mood.dto';

export class CreatePlaceReviewDto {
  @ApiProperty({
    description: 'Place ID',
    type: String,
  })
  @IsString()
  placeId: string;

  @ApiProperty({
    description: 'participants',
    type: Number,
  })
  @IsNumber()
  participants: number;

  @ApiProperty({
    description: 'rating',
    type: Number,
  })
  @IsNumber()
  rating: number;

  @ApiProperty({
    description: 'price_range',
    type: String,
  })
  @IsString()
  price_range: string;

  @ApiProperty({
    description: 'is_cork_charge',
    type: Boolean,
  })
  @IsBoolean()
  is_cork_charge: boolean;

  @ApiProperty({
    description: 'is_room',
    type: Boolean,
  })
  @IsBoolean()
  is_room: boolean;

  @ApiProperty({
    description: 'is_reservation',
    type: Boolean,
  })
  @IsBoolean()
  is_reservation: boolean;

  @ApiProperty({
    description: 'is_parking',
    type: Boolean,
  })
  @IsBoolean()
  is_parking: boolean;

  @ApiProperty({
    description: 'is_advance_payment',
    type: Boolean,
  })
  @IsBoolean()
  is_advance_payment: boolean;

  @ApiProperty({
    description: 'is_rent',
    type: Boolean,
  })
  @IsBoolean()
  is_rent: boolean;

  @ApiProperty({
    description: 'simple_Review ',
    type: String,
  })
  @IsBoolean()
  simple_review: string;

  @ApiProperty({
    description: 'ReivewMood',
    type: ReviewMoodDto,
    example: {
      mood_category: ReviewCategoryMoodEnum.Mood,
      mood: MoodEnum.Light,
    },
    isArray: true,
  })
  @IsArray()
  reveiwMoodDto: ReviewMoodDto[];
}
