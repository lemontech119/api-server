import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Place } from './place.entity';

@Entity()
export class PlaceInfo {
  @ApiProperty({
    example: '1d6996ed-cd26-4387-ae89-6acc6912aa66',
    description: 'id',
  })
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @OneToOne(() => Place, (place) => place.place_Info, {
    eager: false,
  })
  place: Place;

  @ApiProperty({
    example: 'http://place.map.kakao.com/234127678',
    description: '카카오 맵 URL',
  })
  @Column()
  url: string;

  @ApiProperty({
    example: '서울 강남구 신사동 644-6',
    description: '지번 주소',
  })
  @Column()
  address: string;

  @ApiProperty({
    example: '서울 강남구 언주로170길 22',
    description: '도로명 주소',
  })
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
