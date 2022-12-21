import { Test, TestingModule } from '@nestjs/testing';
import { PlaceStatsService } from './place_stats.service';

describe('PlaceMoodService', () => {
  let service: PlaceStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlaceStatsService],
    }).compile();

    service = module.get<PlaceStatsService>(PlaceStatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
