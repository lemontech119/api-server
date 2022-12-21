import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';
import { ReveiwMoodDto } from '../../review_mood/dto/review_mood.dto';

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
    description: 'ReivewMood',
    type: ReveiwMoodDto,
    isArray: true,
  })
  @IsArray()
  reveiwMoodDto: ReveiwMoodDto[];
}
