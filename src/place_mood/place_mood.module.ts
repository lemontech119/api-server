import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceMood } from './Entity/place_mood.entity';
import { PlaceMoodController } from './place_mood.controller';
import { PlaceMoodService } from './place_mood.service';
import { PlaceReviewModule } from './../place_review/place_review.module';

@Module({
  imports: [TypeOrmModule.forFeature([PlaceMood]), PlaceReviewModule],
  exports: [PlaceMoodService],
  controllers: [PlaceMoodController],
  providers: [PlaceMoodService],
})
export class PlaceMoodModule {}
