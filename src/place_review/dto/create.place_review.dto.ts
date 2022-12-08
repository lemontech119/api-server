import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

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
    description: 'placeMood',
    type: String,
    isArray: true,
  })
  @IsArray()
  placeMood: string[];
}
