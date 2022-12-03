import { ApiProperty } from '@nestjs/swagger';
import { AddPlaceInfo } from './addPlaceInfo.dto';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class AddPlace {
  @ApiProperty({
    example: '234127678',
    description: '카카오 장소 id',
  })
  @IsNotEmpty()
  @IsString()
  kakaoId: string;

  @ApiProperty({
    example: '키친마이야르',
    description: '장소 이름',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: '양식',
    description: '카테고리',
  })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({
    example: '127.035423195622',
    description: '경도',
  })
  @IsNotEmpty()
  @IsNumber()
  x: number;

  @ApiProperty({
    example: '37.5266092359544',
    description: '위도',
  })
  @IsNotEmpty()
  @IsNumber()
  y: number;

  @ApiProperty({
    description: '장소 상세정보',
  })
  @IsNotEmpty()
  info: AddPlaceInfo;
}
