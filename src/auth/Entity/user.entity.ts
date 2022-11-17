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

  @Column({ type: 'int', width: 20, unsigned: true })
  userId: number;

  @Column()
  nickname: string;

  @Column({ nullable: true })
  vendor: string;

  @Column({ nullable: true })
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
