import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreatePlaceReviewDto {
  @IsString()
  placeId: string;

  @IsNumber()
  participants: number;

  @IsNumber()
  rating: number;

  @IsString()
  price_range: string;

  @IsBoolean()
  is_cork_charge: boolean;

  @IsBoolean()
  is_room: boolean;

  @IsBoolean()
  is_reservation: boolean;
}
