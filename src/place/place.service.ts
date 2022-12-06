import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Place } from './Entity/place.entity';
import { PlaceInfo } from './Entity/placeInfo.entity';
import { PlaceInfoService } from './placeInfo.service';
import { AddPlace } from './dto/addPlace.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(Place)
    @InjectRepository(PlaceInfo)
    private readonly placeRepository: Repository<Place>,
    private readonly placeInfoService: PlaceInfoService,
  ) {}

  async isExistsByKakaoId(kakaoId: string): Promise<boolean> {
    const ret = await this.placeRepository.findOne({
      where: {
        kakaoId,
      },
      select: ['id'],
    });

    return !!ret;
  }

  async createPlace(newPlace: AddPlace): Promise<Place> {
    const place = new Place();
    place.id = uuid();
    place.kakaoId = newPlace.kakaoId;
    place.name = newPlace.name;
    place.category = newPlace.category;
    place.x = newPlace.x;
    place.y = newPlace.y;

    place.place_Info = this.placeInfoService.generatePlaceInfo(newPlace.info);

    await this.placeRepository.save(place);

    return place;
  }
}
