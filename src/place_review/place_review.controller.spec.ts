import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { PlaceModule } from 'src/place/place.module';
import { typeOrmAsyncConfig } from '../database/typeorm.config';
import { PlaceReview } from './Entity/place_review.entity';
import { PlaceReviewController } from './place_review.controller';
import { PlaceReviewModule } from './place_review.module';
import { PlaceReviewService } from './place_review.service';

describe('PlaceReviewController', () => {
  let controller: PlaceReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: process.env.NODE_ENV === 'prod' ? '.env' : '.env.dev',
        }),
        TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
        TypeOrmModule.forFeature([PlaceReview]),
        AuthModule,
        PlaceModule,
        PlaceReviewModule,
      ],
      exports: [PlaceReviewService],
      controllers: [PlaceReviewController],
      providers: [PlaceReviewService],
    }).compile();

    controller = module.get<PlaceReviewController>(PlaceReviewController);
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
  });

  it('test method', async () => {});
});
