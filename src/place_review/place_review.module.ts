import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceReview } from './Entity/place_review.entity';
import { PlaceReviewController } from './place_review.controller';
import { PlaceReviewService } from './place_review.service';
import { PlaceModule } from './../place/place.module';
import { AuthModule } from './../auth/auth.module';
import { ReviewMoodModule } from '../review_mood/review_mood.module';
import { PlaceStatsModule } from 'src/place_stats/place.stats.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([PlaceReview]),
    PlaceModule,
    AuthModule,
    ReviewMoodModule,
    PlaceStatsModule,
  ],
  exports: [PlaceReviewService],
  controllers: [PlaceReviewController],
  providers: [PlaceReviewService],
})
export class PlaceReviewModule {}
