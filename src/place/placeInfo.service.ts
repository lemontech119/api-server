import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaceInfo } from './Entity/placeInfo.entity';
import { AddPlaceInfo } from './dto/addPlaceInfo.dto';
import { generateUuid } from './../utils/gnerator';

@Injectable()
export class PlaceInfoService {
  constructor(
    @InjectRepository(PlaceInfo)
    private readonly placeInfoRepository: Repository<PlaceInfo>,
  ) {}

  generatePlaceInfo(newPlaceInfo: AddPlaceInfo): PlaceInfo {
    const placeInfo = new PlaceInfo();

    placeInfo.id = generateUuid();
    placeInfo.url = newPlaceInfo.url;
    placeInfo.address = newPlaceInfo.address;
    placeInfo.roadAddress = newPlaceInfo.roadAddress;

    return placeInfo;
  }

  async getPlaceInfoById(id: string): Promise<PlaceInfo> {
    const placeInfo = await this.placeInfoRepository.findOne({
      where: {
        id,
      },
    });

    return placeInfo;
  }
}
