import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaceMood } from './Entity/place_mood.entity';
import { PlaceReview } from 'src/place_review/Entity/place_review.entity';
import { Place } from './../place/Entity/place.entity';
import { generateUuid } from './../utils/gnerator';
@Injectable()
export class PlaceMoodService {
  constructor(
    @InjectRepository(PlaceMood)
    private readonly placeMoodRepository: Repository<PlaceMood>,
  ) {}
  async createPlaceMood(placeReview: PlaceReview, place: Place, mood: string) {
    const placeMood = new PlaceMood();
    placeMood.id = generateUuid();
    placeMood.place = place;
    placeMood.place_review = placeReview;
    placeMood.mood = mood;

    return await this.placeMoodRepository.save(placeMood);
  }
}
