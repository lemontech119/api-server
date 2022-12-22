import { ApiProperty } from '@nestjs/swagger';
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
import { PlaceStats } from 'src/place_stats/Entity/place_stats.entity';
import { ReviewMood } from 'src/review_mood/Entity/review_mood.entity';

@Entity()
export class Place {
  @ApiProperty({
    example: '1d6996ed-cd26-4387-ae89-6acc6912aa66',
    description: 'id',
  })
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @OneToMany(() => PlaceReview, (placeReviw) => placeReviw.place, {
    eager: false,
    cascade: true,
  })
  place_review: PlaceReview[];

  @OneToOne(() => PlaceStats, (placeStats) => placeStats.place, {
    eager: false,
    cascade: ['insert'],
  })
  place_stats: PlaceStats;

  @OneToMany(() => ReviewMood, (reviewMood) => reviewMood.place)
  reveiw_mood: ReviewMood[];

  @ApiProperty({
    description: '장소 상세정보',
  })
  @OneToOne(() => PlaceInfo, (placeInfo) => placeInfo.place, {
    eager: false,
    cascade: ['insert'],
  })
  @JoinColumn()
  place_Info: PlaceInfo;

  @OneToMany(() => WantPlace, (wantPlace) => wantPlace.place, {
    eager: false,
  })
  @JoinColumn()
  want_place: WantPlace;

  @ApiProperty({
    example: '234127678',
    description: '카카오 장소 id',
  })
  @Column({ name: 'kakao_id' })
  kakaoId: string; // 카카오 측 id

  @ApiProperty({
    example: '키친마이야르',
    description: '장소 이름',
  })
  @Column()
  name: string;

  @ApiProperty({
    example: '양식',
    description: '카테고리',
  })
  @Column()
  category: string;

  @ApiProperty({
    example: '127.035423195622',
    description: '경도',
  })
  @Column({ type: 'decimal', precision: 11, scale: 8, default: 0 })
  x: number;

  @ApiProperty({
    example: '37.5266092359544',
    description: '위도',
  })
  @Column({ type: 'decimal', precision: 11, scale: 8, default: 0 })
  y: number;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;
}
