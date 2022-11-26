import { Exclude } from 'class-transformer';
import { PlaceReview } from 'src/place_review/Entity/place_review.entity';
import { WantPlace } from 'src/want_place/Entity/want_place.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'int', width: 20, unsigned: true })
  userId: number;

  @OneToMany(() => PlaceReview, (placeReview) => placeReview.user, {
    cascade: true,
    eager: false,
  })
  place_Reviews: PlaceReview[];

  @OneToMany(() => WantPlace, (wantPlace) => wantPlace.user, {
    cascade: true,
    eager: false,
  })
  want_places: WantPlace[];

  @Column()
  nickname: string;

  @Column({ nullable: true })
  vendor: string;

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;
}
