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
import { GetPlaceDetail } from './types/getPlaceDetail.type';
import { GetPlaceSearch } from './types/getPlaceSearch.type';

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

  async isExistsById(id: string): Promise<boolean> {
    const ret = await this.placeRepository.findOne({
      where: {
        id,
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

  async findByIdForSearch(id: string): Promise<GetPlaceSearch> {
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
        'stats.mood as mood',
        'stats.lighting as lighting',
        'stats.praised as praised',
        'COUNT(want.placeId) as wantplaceCnt',
      ])
      .getRawOne();

    query.wantplaceCnt = parseInt(query.wantplaceCnt);

    const result: GetPlaceSearch = query;

    return result;
  }

  async findPlaceDetail(id: string): Promise<GetPlaceDetail> {
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
      .addSelect((sub) => {
        return sub
          .subQuery()
          .from(PlaceReview, 'review')
          .where('placeId = :id', { id })
          .select('ROUND(AVG(participants))', 'participantsAvg');
      }, 'participantsAvg')
      .addSelect((sub) => {
        return sub
          .subQuery()
          .from(PlaceReview, 'A')
          .groupBy('A.price_range')
          .addGroupBy('A.placeId')
          .having('A.placeId = :id', { id })
          .orderBy('COUNT(price_range)', 'DESC')
          .select('price_range')
          .limit(1);
      }, 'priceAvg')
      .addSelect([
        'stats.review_cnt as reviewCnt',
        'stats.rating_avrg as ratingAvg',
        'stats.mood as mood',
        'stats.lighting as lighting',
        'stats.praised as praised',
      ])
      .addSelect((sub) => {
        return sub
          .subQuery()
          .from(PlaceStats, 'A')
          .leftJoin(ReviewMood, 'B', 'A.placeId = :id AND A.mood = B.mood', {
            id,
          })
          .select('COUNT(B.mood)');
      }, 'moodCnt')
      .addSelect((sub) => {
        return sub
          .subQuery()
          .from(PlaceStats, 'A')
          .leftJoin(
            ReviewMood,
            'B',
            'A.placeId = :id AND A.lighting = B.mood',
            {
              id,
            },
          )
          .select('COUNT(B.mood)');
      }, 'lightingCnt')
      .addSelect((sub) => {
        return sub
          .subQuery()
          .from(PlaceStats, 'A')
          .leftJoin(ReviewMood, 'B', 'A.placeId = :id AND A.praised = B.mood', {
            id,
          })
          .select('COUNT(B.mood)');
      }, 'praisedCnt')
      .addSelect((sub) => {
        return sub
          .subQuery()
          .from(WantPlace, 'A')
          .where('A.placeId = :id', { id })
          .select('COUNT(A.placeId)');
      }, 'wantPlaceCnt')
      .getRawOne();

    query.x = parseFloat(query.x);
    query.y = parseFloat(query.y);
    query.participantsAvg = parseInt(query.participantsAvg);
    query.moodCnt = parseInt(query.moodCnt);
    query.lightingCnt = parseInt(query.lightingCnt);
    query.praisedCnt = parseInt(query.praisedCnt);
    query.wantPlaceCnt = parseInt(query.wantPlaceCnt);

    const result: GetPlaceDetail = query;

    return result;
  }
}
