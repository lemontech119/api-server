import { Test, TestingModule } from '@nestjs/testing';
import { WantPlaceController } from './want_place.controller';

describe('WantPlaceController', () => {
  let controller: WantPlaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WantPlaceController],
    }).compile();

    controller = module.get<WantPlaceController>(WantPlaceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
