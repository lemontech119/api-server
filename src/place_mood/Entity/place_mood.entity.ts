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

@Entity()
export class PlaceMood {
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
  @ManyToOne(() => Place, (place) => place.place_mood, {
    onDelete: 'CASCADE',
    eager: false,
  })
  place: Place;

  @ApiProperty({
    type: () => PlaceReview,
    required: false,
  })
  @ManyToOne(() => PlaceReview, (placeReview) => placeReview.place_mood, {
    onDelete: 'CASCADE',
    eager: false,
  })
  place_review: PlaceReview;

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
