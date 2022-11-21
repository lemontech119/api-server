import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ name: 'user_id', type: 'int', width: 20, unsigned: true })
  userId: number;

  @Column({ unique: true })
  nickname: string;

  @Column({ nullable: true })
  vendor: string;

  @Column({})
  image: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ name: 'age_range', nullable: true })
  ageRange: string;

  @Column({ nullable: true })
  email: string;

  @Column({ name: 'refresh_token', nullable: true })
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
