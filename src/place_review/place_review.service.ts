import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlaceReviewDto } from './dto/create.place_review.dto';
import { PlaceReview } from './Entity/place_review.entity';
import { Place } from './../place/Entity/place.entity';
import { User } from 'src/auth/Entity/user.entity';
import { generateUuid } from './../utils/gnerator';
@Injectable()
export class PlaceReviewService {
  constructor(
    @InjectRepository(PlaceReview)
    private readonly placeReviewRepository: Repository<PlaceReview>,
  ) {}

  async createReview(
    createPlaceReviewDto: CreatePlaceReviewDto,
    place: Place,
    user: User,
  ): Promise<{
    placeReviewId: string;
  }> {
    const {
      participants,
      rating,
      price_range,
      is_cork_charge,
      is_reservation,
      is_room,
    } = createPlaceReviewDto;

    const newReview = new PlaceReview();

    newReview.id = generateUuid();
    newReview.place = place;
    newReview.participants = participants;
    newReview.rating = rating;
    newReview.price_range = price_range;
    newReview.is_cork_charge = is_cork_charge;
    newReview.is_reservation = is_reservation;
    newReview.is_room = is_room;
    newReview.user = user;

    const result = await this.placeReviewRepository.save(newReview);

    return { placeReviewId: result.id };
  }

  async findById(id: string): Promise<PlaceReview[]> {
    return await this.placeReviewRepository.find({
      relations: {
        place: true,
      },
      where: {
        id,
      },
    });
  }
}
