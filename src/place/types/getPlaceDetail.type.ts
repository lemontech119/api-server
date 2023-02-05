import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsDate,
} from 'class-validator';

export class GetPlaceDetail {
  @ApiProperty({
    example: '1d6996ed-cd26-4387-ae89-6acc6912aa66',
    description: 'id',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    example: '123451234',
    description: 'kakaoId',
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
    example: '양식',
    description: '카테고리',
  })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({
    example: 'http://place.map.kakao.com/1674485211',
    description: 'url',
  })
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiProperty({
    example: '서울 중구 신당동 ***-*',
    description: '주소',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    example: '서울 중구 동호로12길 77',
    description: '도로명 주소',
  })
  @IsNotEmpty()
  @IsString()
  roadAddress: string;

  @ApiProperty({
    example: '맛있고 좋다',
    description: '한줄평',
  })
  @IsNotEmpty()
  @IsString()
  simple_review: string;

  @ApiProperty({
    example: '2022-12-22 05:52:01',
    description: '한줄평 날짜 시간',
  })
  @IsNotEmpty()
  @IsDate()
  review_createdAt: Date;

  @ApiProperty({
    example: true,
    description: '콜키지',
  })
  @IsNotEmpty()
  @IsBoolean()
  is_cork_charge: boolean;

  @ApiProperty({
    example: true,
    description: '룸 여부',
  })
  @IsNotEmpty()
  @IsBoolean()
  is_room: boolean;

  @ApiProperty({
    example: true,
    description: '예약',
  })
  @IsNotEmpty()
  @IsBoolean()
  is_reservation: boolean;

  @ApiProperty({
    example: true,
    description: '주차',
  })
  @IsNotEmpty()
  @IsBoolean()
  is_parking: boolean;

  @ApiProperty({
    example: true,
    description: '선결제',
  })
  @IsNotEmpty()
  @IsBoolean()
  is_advance_payment: boolean;

  @ApiProperty({
    example: true,
    description: '대여',
  })
  @IsNotEmpty()
  @IsBoolean()
  is_rent: boolean;

  @ApiProperty({
    example: '11',
    description: '리뷰 개수',
  })
  @IsNotEmpty()
  @IsNumber()
  reviewCnt: number;

  @ApiProperty({
    example: '4.5',
    description: '평점',
  })
  @IsNotEmpty()
  @IsNumber()
  ratingAvg: number;

  @ApiProperty({
    example: '가벼운',
    description: '분위기',
  })
  @IsNotEmpty()
  @IsString()
  mood: string;

  @ApiProperty({
    example: '10',
    description: '분위기 개수',
  })
  @IsNotEmpty()
  @IsNumber()
  moodCnt: number;

  @ApiProperty({
    example: '어두운',
    description: '밝기',
  })
  @IsNotEmpty()
  @IsString()
  lighting: string;

  @ApiProperty({
    example: '11',
    description: '밝기 개수',
  })
  @IsNotEmpty()
  @IsNumber()
  lightingCnt: number;

  @ApiProperty({
    example: '20',
    description: '가고 싶은 곳 개수',
  })
  @IsNotEmpty()
  @IsNumber()
  wantPlaceCnt: number;
}
