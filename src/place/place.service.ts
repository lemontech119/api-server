import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Place } from './Entity/place.entity';

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
  ) {}
}