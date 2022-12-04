import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from './Entity/place.entity';
import { PlaceInfo } from './Entity/placeInfo.entity';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { PlaceInfoService } from './placeInfo.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([Place, PlaceInfo]),
  ],
  exports: [PlaceService, PlaceInfoService],
  controllers: [PlaceController],
  providers: [PlaceService, PlaceInfoService],
})
export class PlaceModule {}
