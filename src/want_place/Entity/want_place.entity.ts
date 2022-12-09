import { User } from 'src/auth/Entity/user.entity';
import { Place } from 'src/place/Entity/place.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class WantPlace {
  @ApiProperty({
    required: false,
    type: String,
  })
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @ApiProperty({
    required: false,
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.want_places, {
    onDelete: 'CASCADE',
    eager: false,
  })
  user: User;

  @ApiProperty({
    required: false,
    type: () => Place,
  })
  @OneToOne(() => Place, (place) => place.want_place, { eager: false })
  place: Place;

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
