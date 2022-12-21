import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlaceMood } from './Entity/place_mood.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlaceMoodService {
  constructor(
    @InjectRepository(PlaceMood)
    private readonly placeMoodRepository: Repository<PlaceMood>,
  ) {}
}
