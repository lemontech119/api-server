import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { PlaceMoodService } from './place_mood.service';
import { AuthGuard } from './../auth/security/jwt.Guard';
import { CreatePlaceMoodDto } from './dto/create.place_mood.dto';
import { PlaceMood } from './Entity/place_mood.entity';
import { PlaceReviewService } from 'src/place_review/place_review.service';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Place-mood Api')
@Controller('place-mood')
export class PlaceMoodController {
  constructor(
    private readonly placeMoodService: PlaceMoodService,
    private readonly placeReviewService: PlaceReviewService,
  ) {}

  @ApiOperation({ summary: 'createMood', description: 'createMood' })
  @ApiHeader({ name: 'Authorization', description: 'auth token' })
  @ApiBody({
    description: 'CreatePlaceMoodDto',
    required: true,
    type: CreatePlaceMoodDto,
    isArray: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Array of PlaceMood',
    type: PlaceMood,
    isArray: true,
  })
  @UseGuards(AuthGuard)
  @Post()
  async createMood(@Body() createPlaceMoodDtos: CreatePlaceMoodDto[]) {
    const reuslt: PlaceMood[] = [];
    for (const createPlaceMoodDto of createPlaceMoodDtos) {
      const placeReview = await this.placeReviewService.findById(
        createPlaceMoodDto.placeReviewId,
      );
      const place = placeReview[0].place;
      const placeMood = await this.placeMoodService.createPlaceMood(
        placeReview[0],
        place,
        createPlaceMoodDto.mood,
      );
      reuslt.push(placeMood);
    }
    return reuslt;
  }
}
