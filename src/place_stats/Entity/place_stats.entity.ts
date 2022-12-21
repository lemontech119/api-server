import { ApiProperty } from '@nestjs/swagger';
import { Place } from 'src/place/Entity/place.entity';
import {
  ReviewLightingEnum,
  ReviewMoodEnum,
  ReviewPraisedEnum,
} from 'src/review_mood/review_mood.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PlaceStats {
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
  @OneToOne(() => Place, (place) => place.place_mood, {
    eager: false,
    cascade: ['insert'],
  })
  place: Place;

  @ApiProperty({
    example: '0',
    description: '리뷰 수',
  })
  @Column({ name: 'review_cnt', default: 0 })
  reviewCnt: number;

  @ApiProperty({
    example: '0',
    description: '리뷰평점',
  })
  @Column({ name: 'rating_avrg', default: 0, type: 'float' })
  ratingAvrg: number;

  @ApiProperty({
    required: false,
    type: String,
  })
  @Column()
  mood: ReviewMoodEnum;

  @ApiProperty({
    required: false,
    type: String,
  })
  @Column()
  light: ReviewLightingEnum;

  @ApiProperty({
    required: false,
    type: String,
  })
  @Column()
  praised: ReviewPraisedEnum;

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
