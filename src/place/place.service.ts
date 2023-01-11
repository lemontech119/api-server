import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
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
import { KeywordSearchDto } from './dto/keywordSearch.dto';
import * as qs from 'qs';
import {
  ReviewLightingEnum,
  ReviewMoodEnum,
  ReviewPraisedEnum,
} from 'src/review_mood/review_mood.enum';
@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(Place)
    @InjectRepository(PlaceInfo)
    private readonly placeRepository: Repository<Place>,
    private readonly placeInfoService: PlaceInfoService,
    private readonly dataSource: DataSource,
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
          .leftJoin(ReviewMood, 'B', 'B.placeId = :id AND A.mood = B.mood', {
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
            'B.placeId = :id AND A.lighting = B.mood',
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
          .leftJoin(ReviewMood, 'B', 'B.placeId = :id AND A.praised = B.mood', {
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

  async placeKeywordSearch(keyword: any) {
    const { participants, price, mood, lighting, praised, etc } = keyword;
    const placeId = this.dataSource
      .createQueryBuilder()
      .subQuery()
      .from(Place, 'p')
      .select('id')
      .getQuery();

    const query = await this.dataSource
      .createQueryBuilder()
      .from((sub) => {
        return sub
          .subQuery()
          .from((sub) => {
            return sub
              .subQuery()
              .from(PlaceReview, 'r')
              .groupBy('r.price_range')
              .addGroupBy('r.placeId')
              .having(`r.placeId IN (${placeId})`)
              .select(['r.placeId as placeId', 'r.price_range as price_range'])
              .addSelect('ROUND(AVG(r.participants))as participantsAvg')
              .addSelect('count(r.price_range) as cnt');
          }, 'a')
          .select('a.*')
          .innerJoin(
            (sub) => {
              return sub
                .subQuery()
                .from((sub) => {
                  return sub
                    .subQuery()
                    .from(PlaceReview, 'r')
                    .groupBy('r.price_range')
                    .addGroupBy('r.placeId')
                    .having(`r.placeId IN (${placeId})`)
                    .select([
                      'r.placeId as placeId',
                      'r.price_range as price_range',
                    ])
                    .addSelect('count(r.price_range) as cnt');
                }, 'c')
                .groupBy('c.placeId')
                .select([
                  'c.placeId as placeId',
                  'c.price_range as price_range',
                ])
                .addSelect('max(cnt) as max');
            },
            'b',
            'a.placeId = b.placeId and a.cnt = b.max',
          );
      }, 'A')
      .leftJoin(PlaceStats, 'B', 'A.placeId = B.placeId')
      .leftJoin(
        (sub) => {
          return sub
            .subQuery()
            .from(PlaceReview, 'r')
            .groupBy('r.placeId')
            .select([
              'r.placeId as placeId',
              'MAX(is_cork_charge) as is_cork_charge',
              'MAX(is_room) as is_room',
              'Max(is_reservation) as is_reservation',
              'MAX(is_parking) as is_parking',
              'Max(is_advance_payment) as is_advance_payment',
              'Max(is_rent) as is_rent',
            ]);
        },
        'C',
        'A.placeId = C.placeId',
      )
      .select('A.*')
      .addSelect([
        'B.mood as mood',
        'B.lighting as lighting',
        'B.praised as praised',
      ])
      .addSelect([
        'C.is_cork_charge as is_cork_charge',
        'C.is_rent as is_rent',
        'C.is_room as is_room',
        'C.is_reservation as is_reservation',
        'C.is_parking as is_parking',
        'C.is_advance_payment as is_advance_payment',
      ])
      // .where(
      //   `
      //   (
      //     A.participantsAvg >= :min AND
      //     A.participantsAvg <= :max AND
      //     A.price_range = :price AND
      //     B.praised = :praised
      //     )
      //    AND
      //    (
      //     B.lighting = :lighting OR
      //     B.mood = :mood
      //     )
      //     AND
      //     (
      //     A.is_cork_charge = :is_cork_charge AND
      //     A.is_rent = :is_rent AND
      //     A.is_room = :is_room AND
      //     A.is_reservation = :is_reservation AND
      //     A.is_parking = :is_parking AND
      //     A.is_advance_payment = :is_advance_payment
      //     )
      //   `,
      //   {
      //     min: participants['min'],
      //     max: participants['max'],
      //     price,
      //     praised: ReviewPraisedEnum[praised.toString()],
      //     lighting: ReviewLightingEnum[lighting.toString()],
      //     mood: ReviewMoodEnum[mood.toString()],
      //     is_cork_charge: etc['is_cork_charge'],
      //     is_rent: etc['is_rent'],
      //     is_room: etc['is_room'],
      //     is_reservation: etc['is_reservation'],
      //     is_parking: etc['is_parking'],
      //     is_advance_payment: etc['is_advance_payment'],
      //   },
      // )
      .getRawMany();
    console.log(query);
    return query;
  }
}
