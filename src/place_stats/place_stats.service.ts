import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlaceStats } from './Entity/place_stats.entity';
import { Repository, EntityManager } from 'typeorm';
import { CntAndScoreDto } from '../place_review/dto/cntAndScore.dto';
import { MostReviewValue } from './../review_mood/dto/most_review_value.dto';
import { Place } from 'src/place/Entity/place.entity';
import { generateUuid } from 'src/utils/gnerator';

@Injectable()
export class PlaceStatsService {
  constructor(
    @InjectRepository(PlaceStats)
    private readonly placeStatsRepository: Repository<PlaceStats>,
  ) {}

  async updateStats(
    place: Place,
    mostReviewValue: MostReviewValue[],
    reviewCntAndScore: CntAndScoreDto,
    queryRunnerManager: EntityManager,
  ): Promise<void> {
    try {
      let placeStats = await queryRunnerManager.findOne(PlaceStats, {
        relations: { place: true },
        where: { place: { id: place.id } },
      });

      if (!placeStats) {
        placeStats = new PlaceStats();
        placeStats.id = generateUuid();
      }

      placeStats.place = place;
      placeStats.ratingAvrg = reviewCntAndScore.score;
      placeStats.reviewCnt = reviewCntAndScore.cnt;

      for (const most of mostReviewValue) {
        placeStats[most.mood_category] = most.mood;
      }
      await queryRunnerManager.save(PlaceStats, placeStats);
    } catch (err) {
      throw new ConflictException(
        `${err}. Create PlaceStats Failed to Transaction`,
      );
    }
  }
}
