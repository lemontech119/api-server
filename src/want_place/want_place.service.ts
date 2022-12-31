import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Place } from 'src/place/Entity/place.entity';
import { DeleteResult, Repository } from 'typeorm';
import { WantPlace } from './Entity/want_place.entity';
import { User } from 'src/auth/Entity/user.entity';
import { generateUuid } from './../utils/gnerator';

@Injectable()
export class WantPlaceService {
  constructor(
    @InjectRepository(WantPlace)
    private readonly wantPlaceRepository: Repository<WantPlace>,
  ) {}

  async createWantPlace(place: Place, user: User): Promise<WantPlace> {
    const newWantPlace = new WantPlace();
    newWantPlace.id = generateUuid();
    newWantPlace.place = place;
    newWantPlace.user = user;

    return await this.wantPlaceRepository.save(newWantPlace);
  }

  async checkWantPlace(placeId: string, userId: string): Promise<boolean> {
    const wantPlace = await this.wantPlaceRepository.find({
      where: {
        place: { id: placeId },
        user: { id: userId },
      },
    });

    return wantPlace.length < 1;
  }

  async getCountByPlaceId(placeId: string): Promise<number> {
    const wantPlace = await this.wantPlaceRepository.count({
      where: {
        place: { id: placeId },
      },
    });

    return wantPlace;
  }

  async findByUser(userInfo: User): Promise<WantPlace[]> {
    return await this.wantPlaceRepository.find({
      relations: {
        place: true,
      },
      where: {
        user: { id: userInfo.id },
      },
    });
  }

  async deleteWantPlace(id: string): Promise<DeleteResult> {
    return await this.wantPlaceRepository.delete(id);
  }
}
