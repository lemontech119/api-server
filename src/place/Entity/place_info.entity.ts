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
  @JoinColumn()
  place: Place;

  @Column()
  url: string;

  @Column()
  address: string;

  @Column()
  road_address: string;

  @Column()
  detailed_address: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;
}
