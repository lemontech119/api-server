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
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @ManyToOne(() => Place, (place) => place.place_mood, {
    onDelete: 'CASCADE',
    eager: false,
  })
  place: Place;

  @ManyToOne(() => PlaceReview, (placeReview) => placeReview.place_mood, {
    onDelete: 'CASCADE',
    eager: false,
  })
  place_review: PlaceReview;

  @Column()
  mood: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;
}
