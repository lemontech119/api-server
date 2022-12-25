import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewMood } from './Entity/review_mood.entity';
import { ReviewMoodController } from './review_mood.controller';
import { ReviewMoodService } from './review_mood.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewMood]), AuthModule],
  exports: [ReviewMoodService],
  controllers: [ReviewMoodController],
  providers: [ReviewMoodService],
})
export class ReviewMoodModule {}
