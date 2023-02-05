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

  async findByAllPlace() {
    return await this.placeRepository.find();
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
        'COUNT(want.placeId) as wantplaceCnt',
      ])
      .getRawOne();

    query.wantplaceCnt = parseInt(query.wantplaceCnt);

    const result: GetPlaceSearch = query;

    return result;
  }

  async findPlaceDetail(id: string): Promise<GetPlaceDetail> {
    const query = await this.dataSource
      .createQueryBuilder()
      .from((sub) => {
        return sub
          .subQuery()
          .from(Place, 'p')
          .leftJoin(WantPlace, 'w', 'p.id = w.placeId')
          .groupBy('p.id')
          .having('p.id = :id', { id })
          .select([
            'p.id as id',
            'p.kakaoId as kakaoId',
            'p.name as name',
            'p.category as category',
            'p.x as x',
            'p.y as y',
            'p.placeInfoId as placeInfoId',
          ])
          .addSelect('COUNT(w.placeId)', 'wantPlaceCnt');
      }, 'place')
      .leftJoin(PlaceInfo, 'info', 'place.placeInfoId = info.id')
      .leftJoin(
        (sub) => {
          return sub
            .subQuery()
            .from((sub) => {
              return sub
                .subQuery()
                .from(PlaceReview, 'a')
                .groupBy('a.placeId')
                .addGroupBy('a.price_range')
                .having('a.placeId = :id', { id })
                .select([
                  'a.placeId as placeId',
                  'a.price_range as price_range',
                  'COUNT(a.price_range) as cnt',
                  'ROUND(AVG(a.participants)) as parAvg',
                  'MAX(a.is_cork_charge) as is_cork_charge',
                  'MAX(a.is_room) as is_room',
                  'MAX(a.is_reservation) as is_reservation',
                  'MAX(a.is_parking) as is_parking',
                  'MAX(a.is_advance_payment) as is_advance_payment',
                  'MAX(a.is_rent) as is_rent',
                  'MAX(a.createdAt) as createdAt',
                ]);
            }, 'r')
            .innerJoin(PlaceReview, 'i', 'r.createdAt = i.createdAt')
            .select([
              'r.placeId as placeId',
              'i.simple_review as simple_review',
              'MAX(r.createdAt) as createdAt',
              'MAX(r.cnt) as cnt',
              'r.price_range as price_range',
              'ROUND(AVG(r.parAvg)) as participantsAvg',
              'MAX(r.is_cork_charge) as is_cork_charge',
              'MAX(r.is_room) as is_room',
              'MAX(r.is_reservation) as is_reservation',
              'MAX(r.is_parking) as is_parking',
              'MAX(r.is_advance_payment) as is_advance_payment',
              'MAX(r.is_rent) as is_rent',
            ]);
        },
        'review',
        'review.placeId = place.id',
      )
      .leftJoin(PlaceStats, 'stats', 'stats.placeId =  place.id')
      .where('place.id = :id', { id })
      .select([
        'place.id as id',
        'place.kakaoId as kakaoId',
        'place.name as name',
        'place.x as x',
        'place.y as y',
        'place.category as category',
        'place.wantPlaceCnt as wantPlaceCnt',
      ])
      .addSelect([
        'info.url as url',
        'info.address as address',
        'info.roadAddress as roadAddress',
      ])
      .addSelect([
        'review.participantsAvg as participantsAvg',
        'review.price_range as priceRange',
        'review.simple_review as simple_review',
        'review.createdAt',
        'review.is_cork_charge as is_cork_charge',
        'review.is_room as is_room',
        'review.is_reservation as is_reservation',
        'review.is_parking as is_parking',
        'review.is_advance_payment as is_advance_payment',
        'review.is_rent as is_rent',
      ])
      .addSelect([
        'stats.review_cnt as reviewCnt',
        'stats.rating_avrg as ratingAvg',
        'stats.mood as mood',
        'stats.lighting as lighting',
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
      .getRawOne();

    query.x = parseFloat(query.x);
    query.y = parseFloat(query.y);
    // query.participantsAvg = parseInt(query.participantsAvg);
    // query.moodCnt = parseInt(query.moodCnt);
    // query.lightingCnt = parseInt(query.lightingCnt);
    // query.wantPlaceCnt = parseInt(query.wantPlaceCnt);

    const result: GetPlaceDetail = query;

    return result;
  }

  async placeKeywordSearch(
    keyword: KeywordSearchDto,
  ): Promise<GetPlaceSearch[]> {
    const { participants, price, mood, lighting, etc } = keyword;
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
      .leftJoin(
        (sub) => {
          return sub
            .subQuery()
            .from(Place, 'p')
            .leftJoin(WantPlace, 'w', 'p.id = w.placeId')
            .groupBy('p.id')
            .select([
              'p.id as id',
              'p.name as name',
              'p.kakaoId as kakaoid',
              'p.category as category',
              'p.x as x',
              'p.y as y',
              'p.placeInfoId as placeInfoId',
            ])
            .addSelect('COUNT(w.id) as wantPlaceCnt');
        },
        'D',
        'D.Id = A.placeId',
      )
      .leftJoin(PlaceInfo, 'E', 'D.placeInfoId = E.id')
      .select([
        'D.id as id',
        'D.name as name',
        'D.kakaoId as kakaoid',
        'D.category as category',
        'D.x as x',
        'D.y as y',
        'D.wantPlaceCnt as wantPlaceCnt',
      ])
      .addSelect([
        'B.mood as mood',
        'B.lighting as lighting',
        'B.review_cnt as review_cnt',
        'B.rating_avrg as rating_avrg',
      ])
      .addSelect('E.address')
      .where(
        /* 키워드 검색 조건 */
        `
        (
          A.participantsAvg >= :min AND
          A.participantsAvg <= :max AND
          A.price_range = :price
          )
         AND
         (
          B.lighting = :lighting OR
          B.mood = :mood
          )
          AND
          (
          C.is_cork_charge = :is_cork_charge AND
          C.is_rent = :is_rent AND
          C.is_room = :is_room AND
          C.is_reservation = :is_reservation AND
          C.is_parking = :is_parking AND
          C.is_advance_payment = :is_advance_payment
          )
        `,
        {
          min: participants.min,
          max: participants.max,
          price,
          lighting,
          mood,
          is_cork_charge: etc.is_cork_charge,
          is_rent: etc.is_rent,
          is_room: etc.is_room,
          is_reservation: etc.is_reservation,
          is_parking: etc.is_parking,
          is_advance_payment: etc.is_advance_payment,
        },
      )
      .getRawMany();

    const result: GetPlaceSearch[] = query.map((q) => {
      q.wantPlaceCnt = parseInt(q.wantPlaceCnt);
      return q;
    });

    return result;
  }

  parseKeyword(keywordData: any) {
    /* 키워드 파싱 */
    const query = qs.parse(keywordData, {
      decoder(value) {
        if (/^(\d+|\d*\.\d+)$/.test(value)) {
          return parseFloat(value);
        }

        const keywords = {
          true: true,
          false: false,
          null: null,
          undefined: undefined,
        };
        if (value in keywords) {
          return keywords[value];
        }

        return value;
      },
    });

    const { participants, price, mood, lighting, etc } = query;

    /* 키워드 */
    const keyword: KeywordSearchDto = {
      participants: {
        min: Number(participants['min']),
        max: Number(participants['max']),
      },
      price: price.toString(),
      lighting: ReviewLightingEnum[lighting.toString()],
      mood: ReviewMoodEnum[mood.toString()],
      etc: {
        is_cork_charge: etc['is_cork_charge'],
        is_rent: etc['is_rent'],
        is_room: etc['is_room'],
        is_reservation: etc['is_reservation'],
        is_parking: etc['is_parking'],
        is_advance_payment: etc['is_advance_payment'],
      },
    };

    return keyword;
  }
}
