import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaceMood } from './Entity/place_mood.entity';

@Injectable()
export class PlaceMoodService {
  constructor(
    @InjectRepository(PlaceMood)
    private readonly placeMoodRepository: Repository<PlaceMood>,
  ) {}
}
