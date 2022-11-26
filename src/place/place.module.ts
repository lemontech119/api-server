import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from './Entity/place.entity';
import { PlaceInfo } from './Entity/place_info.entity';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { PlaceInfoService } from './place_info.service';

@Module({
  imports: [TypeOrmModule.forFeature([Place, PlaceInfo])],
  exports: [PlaceService, PlaceInfoService],
  controllers: [PlaceController],
  providers: [PlaceService, PlaceInfoService],
})
export class PlaceModule {}
