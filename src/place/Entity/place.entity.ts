import { PlaceMood } from 'src/place_mood/Entity/place_mood.entity';
import { PlaceReview } from 'src/place_review/Entity/place_review.entity';
import { WantPlace } from 'src/want_place/Entity/want_place.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlaceInfo } from './placeInfo.entity';

@Entity()
export class Place {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @OneToMany(() => PlaceReview, (placeReviw) => placeReviw.place, {
    eager: false,
    cascade: true,
  })
  place_review: PlaceReview[];

  @OneToMany(() => PlaceMood, (placeMood) => placeMood.place, {
    eager: false,
    cascade: true,
  })
  place_mood: PlaceMood[];

  @OneToOne(() => PlaceInfo, (placeInfo) => placeInfo.place, {
    eager: false,
    cascade: ['insert'],
  })
  @JoinColumn()
  place_Info: PlaceInfo;

  @OneToOne(() => WantPlace, (wantPlace) => wantPlace.place, {
    eager: false,
  })
  @JoinColumn()
  want_place: WantPlace;

  @Column({ name: 'kakao_id' })
  kakaoId: string; // 카카오 측 id

  @Column()
  name: string;

  @Column()
  category: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  x: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  y: number;

  @Column({ name: 'review_cnt', default: 0 })
  reviewCnt: number;

  @Column({ name: 'rating_avrg', default: 0, type: 'float' })
  ratingAvrg: number;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;
}
