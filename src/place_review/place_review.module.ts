import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceReview } from './Entity/place_review.entity';
import { PlaceReviewController } from './place_review.controller';
import { PlaceReviewService } from './place_review.service';
import { PlaceModule } from './../place/place.module';
import { AuthModule } from './../auth/auth.module';
@Module({
  imports: [TypeOrmModule.forFeature([PlaceReview]), PlaceModule, AuthModule],
  exports: [PlaceReviewService],
  controllers: [PlaceReviewController],
  providers: [PlaceReviewService],
})
export class PlaceReviewModule {}
