import { Module } from '@nestjs/common';
import { PlaceStatsController } from './place_stats.controller';
import { PlaceStatsService } from './place_stats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceStats } from './Entity/place_stats.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([PlaceStats]), AuthModule],
  exports: [PlaceStatsService],
  controllers: [PlaceStatsController],
  providers: [PlaceStatsService],
})
export class PlaceStatsModule {}
