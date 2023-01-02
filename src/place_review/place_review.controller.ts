import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  Get,
  Param,
} from '@nestjs/common';
import { PlaceReviewService } from './place_review.service';
import { CreatePlaceReviewDto } from './dto/create.place_review.dto';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from './../auth/Entity/user.entity';
import { AuthGuard } from './../auth/security/jwt.Guard';
import { PlaceService } from './../place/place.service';
import { Place } from './../place/Entity/place.entity';
import { ReviewMoodService } from '../review_mood/review_mood.service';
import { TransactionInterceptor } from './../utils/transactionInterceptor';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TransactionManager } from 'src/decorator/transaction.decorator';
import { EntityManager } from 'typeorm';
import { PlaceReview } from './Entity/place_review.entity';
import { PlaceStatsService } from 'src/place_stats/place_stats.service';
import { PlaceStats } from 'src/place_stats/Entity/place_stats.entity';

@ApiTags('Place-review Api')
@Controller('place-review')
export class PlaceReviewController {
  constructor(
    private readonly placeReviewService: PlaceReviewService,
    private readonly placeService: PlaceService,
    private readonly reviewMoodService: ReviewMoodService,
    private readonly placeStatsService: PlaceStatsService,
  ) {}
  @ApiOperation({ summary: 'findAll Review', description: 'Get Place Reviews' })
  @ApiParam({ name: 'placeId', description: 'UUID', type: String })
  @ApiResponse({
    type: PlaceReview,
    isArray: true,
    description: 'Success',
    status: 200,
  })
  @Get()
  findAll(@Param('placeId') placeId: string): Promise<PlaceReview[]> {
    return this.placeReviewService.findByPlaceId(placeId);
  }

  @ApiOperation({ summary: ' findOne', description: 'Get Review' })
  @ApiParam({ name: 'id', description: 'UUID', type: String })
  @ApiResponse({
    type: PlaceReview,
    description: 'Success',
    status: 200,
  })
  @Get('/:id')
  findOne(@Param('id') id: string): Promise<PlaceReview> {
    return this.placeReviewService.findById(id);
  }

  @ApiOperation({ summary: 'createReview', description: 'createReview' })
  @ApiHeader({ name: 'Authorization', description: 'auth token' })
  @ApiBody({
    description: 'CreatePlaceReviewDto',
    required: true,
    type: CreatePlaceReviewDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Place_Review Result',
    type: Boolean,
  })
  @UseGuards(AuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Post()
  async createReview(
    @Body() createPlaceReviewDto: CreatePlaceReviewDto,
    @GetUser() user: User,
    @TransactionManager() queryRunnerManager: EntityManager,
  ): Promise<boolean> {
    const place = await this.checkPlace(createPlaceReviewDto.placeId);

    let placeStats = await this.placeStatsService.isExistsByPlaceId(place.id);

    if (!placeStats) {
      placeStats = await this.placeStatsService.createStats(place);
    }

    /**
     * Transaction Start
     */
    const newPlaceReview = await this.placeReviewService.createReview(
      createPlaceReviewDto,
      place,
      user,
      queryRunnerManager,
    );

    for (const reviewMood of createPlaceReviewDto.reveiwMoodDto) {
      await this.reviewMoodService.createPlaceMood(
        newPlaceReview,
        place,
        reviewMood,
        queryRunnerManager,
      );
    }

    const mostReviewValue = await this.reviewMoodService.findMostValue(
      place.id,
      queryRunnerManager,
    );

    const reviewCntAndScore = await this.placeReviewService.calCntAndScore(
      place.id,
      queryRunnerManager,
    );

    await this.placeStatsService.updateStats(
      placeStats,
      place,
      mostReviewValue,
      reviewCntAndScore,
      queryRunnerManager,
    );

    return true;
  }

  async checkPlace(placeId: string): Promise<Place> {
    const result = await this.placeService.findById(placeId);
    return result;
  }
}
