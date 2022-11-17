import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class GetUserDto {
  @ApiProperty({
    example: '1234567890',
    description: 'User ID',
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: '홍길동',
    description: 'User NickName',
  })
  @IsNotEmpty()
  @IsString()
  nickname: string;
}
