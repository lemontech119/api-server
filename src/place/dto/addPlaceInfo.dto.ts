import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddPlaceInfo {
  @ApiProperty({
    example: 'http://place.map.kakao.com/234127678',
    description: '카카오 맵 URL',
  })
  @IsString()
  url: string;

  @ApiProperty({
    example: '서울 강남구 신사동 644-6',
    description: '지번 주소',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    example: '서울 강남구 언주로170길 22',
    description: '도로명 주소',
  })
  @IsString()
  roadAddress: string;
}
