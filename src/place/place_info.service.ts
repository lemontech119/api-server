import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaceInfo } from './Entity/place_info.entity';

@Injectable()
export class PlaceInfoService {
  constructor(
    @InjectRepository(PlaceInfo)
    private readonly placeInfoRepository: Repository<PlaceInfo>,
  ) {}
}
