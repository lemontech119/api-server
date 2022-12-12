import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class GetAllPlace {
  @ApiProperty({
    example: '1d6996ed-cd26-4387-ae89-6acc6912aa66',
    description: 'id',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

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
}
