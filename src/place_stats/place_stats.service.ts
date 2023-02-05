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
    placeStats: PlaceStats,
    place: Place,
    mostReviewValue: MostReviewValue[],
    reviewCntAndScore: CntAndScoreDto,
    queryRunnerManager: EntityManager,
  ): Promise<void> {
    try {
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

  async isExistsByPlaceId(placeId: string): Promise<PlaceStats> {
    const placeStats = await this.placeStatsRepository.find({
      relations: { place: true },
      where: { place: { id: placeId } },
    });

    return placeStats[0];
  }

  async createStats(place: Place): Promise<PlaceStats> {
    return await this.placeStatsRepository.save({
      id: generateUuid(),
      lighting: null,
      mood: null,
      place,
    });
  }
}
