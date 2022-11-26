import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WantPlace } from './Entity/want_place.entity';

@Injectable()
export class WantPlaceService {
  constructor(
    @InjectRepository(WantPlace)
    private readonly wantPlaceRepository: Repository<WantPlace>,
  ) {}
}
