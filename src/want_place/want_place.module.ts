import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WantPlace } from './Entity/want_place.entity';
import { WantPlaceController } from './want_place.controller';
import { WantPlaceService } from './want_place.service';

@Module({
  imports: [TypeOrmModule.forFeature([WantPlace])],
  exports: [WantPlaceService],
  controllers: [WantPlaceController],
  providers: [WantPlaceService],
})
export class WantPlaceModule {}
