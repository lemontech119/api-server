import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChartController } from './chart.controller';
import { ChartService } from './chart.service';
import { Chart } from './Entity/chart.entity';
import { PlaceModule } from '../place/place.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chart]), PlaceModule],
  controllers: [ChartController],
  providers: [ChartService],
})
export class ChartModule {}
