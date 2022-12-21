import { Module } from '@nestjs/common';
import { PlaceMoodController } from './place_mood.controller';
import { PlaceMoodService } from './place_mood.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceMood } from './Entity/place_mood.entity';
import { AuthModule } from './../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([PlaceMood]), AuthModule],
  controllers: [PlaceMoodController],
  providers: [PlaceMoodService],
})
export class PlaceMoodModule {}
