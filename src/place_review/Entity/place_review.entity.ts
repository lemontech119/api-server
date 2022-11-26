import { User } from 'src/auth/Entity/user.entity';
import { Place } from 'src/place/Entity/place.entity';
import { PlaceMood } from 'src/place_mood/Entity/place_mood.entity';
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
export class PlaceReview {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @ManyToOne(() => User, (user) => user.place_Reviews, {
    onDelete: 'CASCADE',
    eager: false,
  })
  user: User;

  @OneToMany(() => PlaceMood, (placeMood) => placeMood.place_review, {
    cascade: true,
    eager: false,
  })
  place_mood: PlaceMood[];

  @ManyToOne(() => Place, (place) => place.place_review, {
    onDelete: 'CASCADE',
    eager: false,
  })
  place: Place;

  @Column()
  participants: number; // 변경 필요 인원 수

  @Column()
  rating: number;

  @Column()
  price_range: string;

  @Column()
  is_cork_charge: boolean; // 콜키지

  @Column()
  is_room: boolean;

  @Column()
  is_reservation: boolean;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;
}
