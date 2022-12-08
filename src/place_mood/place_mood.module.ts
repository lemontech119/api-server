import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceMood } from './Entity/place_mood.entity';
import { PlaceMoodController } from './place_mood.controller';
import { PlaceMoodService } from './place_mood.service';
@Module({
  imports: [TypeOrmModule.forFeature([PlaceMood])],
  exports: [PlaceMoodService],
  controllers: [PlaceMoodController],
  providers: [PlaceMoodService],
})
export class PlaceMoodModule {}
