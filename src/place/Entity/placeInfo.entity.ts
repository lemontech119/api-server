import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Place } from './place.entity';

@Entity()
export class PlaceInfo {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @OneToOne(() => Place, (place) => place.place_Info, {
    eager: false,
  })
  place: Place;

  @Column()
  url: string;

  @Column()
  address: string;

  @Column({ name: 'road_address' })
  roadAddress: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;
}
