import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePlaceMoodDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  placeReviewId: string;
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  mood: string;
}
