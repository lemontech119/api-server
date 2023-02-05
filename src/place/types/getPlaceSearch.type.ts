import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class GetPlaceSearch {
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
    example: '어두운',
    description: '밝기',
  })
  @IsNotEmpty()
  @IsString()
  lighting: string;

  @ApiProperty({
    example: '20',
    description: '가고 싶은 곳 개수',
  })
  @IsNotEmpty()
  @IsNumber()
  wantPlaceCnt: number;
}
