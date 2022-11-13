import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'int', width: 20, unsigned: true })
  userId: number;

  @Column()
  nickname: string;
}
