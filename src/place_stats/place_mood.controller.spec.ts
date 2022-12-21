import { Test, TestingModule } from '@nestjs/testing';
import { PlaceStatsController } from './place_stats.controller';

describe('PlaceStatsController', () => {
  let controller: PlaceStatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaceStatsController],
    }).compile();

    controller = module.get<PlaceStatsController>(PlaceStatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
