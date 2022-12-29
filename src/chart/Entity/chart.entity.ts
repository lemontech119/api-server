import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  Column,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity()
export class Chart {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Index()
  @Column()
  name: string;

  @Column({ name: 'place_id' })
  placeId: string;

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
