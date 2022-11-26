import { Test, TestingModule } from '@nestjs/testing';
import { PlaceMoodService } from './place_mood.service';

describe('PlaceMoodService', () => {
  let service: PlaceMoodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlaceMoodService],
    }).compile();

    service = module.get<PlaceMoodService>(PlaceMoodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
