import { Test, TestingModule } from '@nestjs/testing';
import { WantPlaceService } from './want_place.service';

describe('WantPlaceService', () => {
  let service: WantPlaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WantPlaceService],
    }).compile();

    service = module.get<WantPlaceService>(WantPlaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
