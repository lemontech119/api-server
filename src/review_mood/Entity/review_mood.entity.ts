import { ApiProperty } from '@nestjs/swagger';
import { Place } from 'src/place/Entity/place.entity';
import { PlaceReview } from 'src/place_review/Entity/place_review.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

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
  @OneToMany(() => PlaceReview, (placeReview) => placeReview.review_mood, {
    onDelete: 'CASCADE',
    eager: false,
  })
  place_review: PlaceReview;

  @ApiProperty({
    required: false,
    type: String,
  })
  mood_category: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @Column()
  mood: string;

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
