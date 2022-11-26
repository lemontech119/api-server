import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceReview } from './Entity/place_review.entity';
import { PlaceReviewController } from './place_review.controller';
import { PlaceReviewService } from './place_review.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlaceReview])],
  exports: [PlaceReviewService],
  controllers: [PlaceReviewController],
  providers: [PlaceReviewService],
})
export class PlaceReviewModule {}
