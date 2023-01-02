import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Place } from './Entity/place.entity';
import { PlaceInfo } from './Entity/placeInfo.entity';
import { PlaceInfoService } from './placeInfo.service';
import { AddPlace } from './dto/addPlace.dto';
import { generateUuid } from './../utils/gnerator';
import { PlaceReview } from './../place_review/Entity/place_review.entity';
import { PlaceStats } from './../place_stats/Entity/place_stats.entity';
import { ReviewMood } from './../review_mood/Entity/review_mood.entity';
import { WantPlace } from './../want_place/Entity/want_place.entity';

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
    place.id = generateUuid();
    place.kakaoId = newPlace.kakaoId;
    place.name = newPlace.name;
    place.category = newPlace.category;
    place.x = newPlace.x;
    place.y = newPlace.y;

    place.place_Info = this.placeInfoService.generatePlaceInfo(newPlace.info);

    await this.placeRepository.save(place);

    return place;
  }

  async findById(id: string): Promise<Place> {
    const result = await this.placeRepository.find({
      where: {
        id,
      },
    });
    if (result.length < 1) {
      throw new NotFoundException('Can not find place with id');
    }
    return result[0];
  }

  async findAll(): Promise<Place[]> {
    const ret = await this.placeRepository.find({
      where: {
        place_review: true,
      },
      select: ['id', 'x', 'y', 'name'],
    });

    return ret;
  }

  async findByIdList(idList: string[]): Promise<Place[]> {
    const ret = await this.placeRepository.find({
      where: {
        id: In(idList),
      },
      relations: {
        place_stats: true,
        place_Info: true,
      },
    });

    return ret;
  }

  async kakaoIdByPlace(kakaoId: string): Promise<Place> {
    return await this.placeRepository.findOne({ where: { kakaoId } });
  }

  async findByIdForSearch(id: string) {
    const query = await this.placeRepository
      .createQueryBuilder('place')
      .leftJoin('place.place_Info', 'info')
      .leftJoin(PlaceStats, 'stats', 'stats.placeId = place.id')
      .leftJoin(WantPlace, 'want', 'want.placeId = place.id')
      .where('place.id = :id', { id })
      .select([
        'place.id as id',
        'place.kakaoId as kakaoId',
        'place.name as name',
        'place.category as category',
        'info.address as address',
        'stats.rating_avrg',
        'stats.review_cnt',
        'COUNT(want.placeId) as wantplaceCnt',
      ])
      .getRawOne();

    return query;
  }

  async getPlaceDetail(id: string) {
    const PriceAvg = this.placeRepository
      .createQueryBuilder('place')
      .leftJoin(PlaceReview, 'review', 'review.placeId = place.id')
      .groupBy('review.price_range')
      .addGroupBy('place.id')
      .having('place.id = :id', { id })
      .orderBy('COUNT(review.price_range)', 'DESC')
      .limit(1)
      .select('review.price_range')
      .getQuery();

    const WantPlaceCnt = this.placeRepository
      .createQueryBuilder('place')
      .leftJoin(WantPlace, 'want', 'want.placeId = place.id')
      .groupBy('want.placeId')
      .having('place.id = :id', { id })
      .select('COUNT(want.placeId)')
      .getQuery();

    const MoodCnt = this.placeRepository
      .createQueryBuilder('place')
      .leftJoin(PlaceStats, 'stats', 'stats.placeId = place.id')
      .leftJoin(ReviewMood, 'mood', 'mood.mood = stats.mood')
      .groupBy('mood.mood')
      .addGroupBy('place.id')
      .having('place.id = :id', { id })
      .select('COUNT(mood.mood)')
      .getQuery();

    const LightingCnt = this.placeRepository
      .createQueryBuilder('place')
      .leftJoin(PlaceStats, 'stats', 'stats.placeId = place.id')
      .leftJoin(ReviewMood, 'mood', 'mood.mood = stats.lighting')
      .groupBy('mood.mood')
      .addGroupBy('place.id')
      .having('place.id = :id', { id })
      .select('COUNT(mood.mood)')
      .getQuery();

    const ParisedCnt = this.placeRepository
      .createQueryBuilder('place')
      .leftJoin(PlaceStats, 'stats', 'stats.placeId = place.id')
      .leftJoin(ReviewMood, 'mood', 'mood.mood = stats.praised')
      .groupBy('mood.mood')
      .addGroupBy('place.id')
      .having('place.id = :id', { id })
      .select('COUNT(mood.mood)')
      .getQuery();

    const query = await this.placeRepository
      .createQueryBuilder('place')
      .leftJoin('place.place_Info', 'info')
      .leftJoin(PlaceReview, 'review', 'review.placeId = place.id')
      .leftJoin(PlaceStats, 'stats', 'stats.placeId =  place.id')
      .where('place.id = :id', { id })
      .orderBy('review.createdAt', 'DESC')
      .limit(1)
      .select([
        'place.id as id',
        'place.kakaoId as kakaoId',
        'place.name as name',
        'place.x as x',
        'place.y as y',
        'place.category as category',
      ])
      .addSelect([
        'info.url as url',
        'info.address as address',
        'info.roadAddress as roadAddress',
      ])
      .addSelect([
        'review.simple_review as simple_review',
        'review.createdAt',
        'review.is_cork_charge as is_cork_charge',
        'review.is_room as is_room',
        'review.is_reservation as is_reservation',
        'review.is_parking as is_parking',
        'review.is_advance_payment as is_advance_payment',
        'review.is_rent as is_rent',
      ])
      .addSelect('ROUND(AVG(review.participants))', 'participantsAvg')
      .addSelect(`(${PriceAvg})`, 'priceAvg')
      .addSelect([
        'stats.review_cnt as reviewCnt',
        'stats.rating_avrg as ratingAvg',
      ])
      .addSelect(`(${MoodCnt})`, 'moodCnt')
      .addSelect(`(${LightingCnt})`, 'lightingCnt')
      .addSelect(`(${ParisedCnt})`, 'parisedCnt')
      .addSelect(`(${WantPlaceCnt})`, 'wantPlaceCnt')
      .getRawOne();

    return query;
  }
}
