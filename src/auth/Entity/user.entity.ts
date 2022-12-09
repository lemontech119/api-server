import { Exclude } from 'class-transformer';
import { PlaceReview } from 'src/place_review/Entity/place_review.entity';
import { WantPlace } from 'src/want_place/Entity/want_place.entity';

import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    required: false,
    type: String,
  })
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @Column({ name: 'user_id', type: 'int', width: 20, unsigned: true })
  userId: number;

  @ApiProperty({
    required: false,
    type: () => PlaceReview,
  })
  @OneToMany(() => PlaceReview, (placeReview) => placeReview.user, {
    cascade: true,
    eager: false,
  })
  place_Reviews: PlaceReview[];

  @ApiProperty({
    required: false,
    type: () => WantPlace,
  })
  @OneToMany(() => WantPlace, (wantPlace) => wantPlace.user, {
    cascade: true,
    eager: false,
  })
  want_places: WantPlace[];

  @ApiProperty({
    required: false,
    type: String,
  })
  @Column()
  nickname: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @Column({ nullable: true })
  vendor: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @Column({})
  image: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @Column({ nullable: true })
  gender: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @Column({ name: 'age_range', nullable: true })
  ageRange: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @Column({ nullable: true })
  email: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @Column({ name: 'refresh_token', nullable: true })
  @Exclude()
  refreshToken: string;

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
