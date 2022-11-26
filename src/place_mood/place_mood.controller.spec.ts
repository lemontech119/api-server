import { Test, TestingModule } from '@nestjs/testing';
import { PlaceMoodController } from './place_mood.controller';

describe('PlaceMoodController', () => {
  let controller: PlaceMoodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaceMoodController],
    }).compile();

    controller = module.get<PlaceMoodController>(PlaceMoodController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
