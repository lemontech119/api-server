import { ApiProperty } from '@nestjs/swagger';
import { Place } from 'src/place/Entity/place.entity';
import { PlaceReview } from 'src/place_review/Entity/place_review.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MoodEnum, ReviewCategoryMoodEnum } from '../review_mood.enum';

@Entity()
export class ReviewMood {
  @ApiProperty({
    required: false,
    type: String,
  })
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @ApiProperty({
    type: () => Place,
    required: false,
  })
  @ManyToOne(() => Place, (place) => place.reveiw_mood, {
    onDelete: 'CASCADE',
    eager: false,
  })
  place: Place;

  @ApiProperty({
    type: () => PlaceReview,
    required: false,
  })
  @ManyToOne(() => PlaceReview, (placeReview) => placeReview.review_mood, {
    onDelete: 'CASCADE',
    eager: false,
  })
  place_review: PlaceReview;

  @ApiProperty({
    required: false,
    enum: ReviewCategoryMoodEnum,
    isArray: true,
  })
  @Column()
  mood_category: ReviewCategoryMoodEnum;

  @ApiProperty({
    required: false,
    enum: MoodEnum,
    isArray: true,
  })
  @Column()
  mood: MoodEnum;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;
}
