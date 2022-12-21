import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlaceStats } from './Entity/place_stats.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlaceStatsService {
  constructor(
    @InjectRepository(PlaceStats)
    private readonly placeStatsRepository: Repository<PlaceStats>,
  ) {}
}
