import { ApiProperty } from '@nestjs/swagger';
import { Place } from 'src/place/Entity/place.entity';
import { MoodEnum } from 'src/review_mood/review_mood.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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
  @OneToOne(() => Place, (place) => place.place_stats, {
    eager: false,
    cascade: ['insert'],
  })
  @JoinColumn()
  place: Place;

  @ApiProperty({
    example: '0',
    description: '리뷰 수',
  })
  @Column({ name: 'review_cnt', default: 0, nullable: true })
  reviewCnt: number;

  @ApiProperty({
    example: '0',
    description: '리뷰평점',
  })
  @Column({ name: 'rating_avrg', default: 0, type: 'float', nullable: true })
  ratingAvrg: number;

  @ApiProperty({
    example: '무거움',
    description: '분위기',
  })
  @Column({ nullable: true })
  mood: MoodEnum;

  @ApiProperty({
    example: '어두움',
    description: '밝기',
  })
  @Column({ nullable: true })
  lighting: MoodEnum;

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
