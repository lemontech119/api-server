import { User } from 'src/auth/Entity/user.entity';
import { Place } from 'src/place/Entity/place.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class WantPlace {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @ManyToOne(() => User, (user) => user.want_places, {
    onDelete: 'CASCADE',
    eager: false,
  })
  user: User;

  @OneToOne(() => Place, (place) => place.want_place, { eager: false })
  @JoinColumn()
  place: Place;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;
}
