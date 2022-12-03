import { ApiProperty } from '@nestjs/swagger';
import { AddPlaceInfo } from './addPlaceInfo.dto';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class AddPlace {
  @IsNotEmpty()
  @IsString()
  kakaoId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsNumber()
  x: number;

  @IsNotEmpty()
  @IsNumber()
  y: number;

  @IsNotEmpty()
  info: AddPlaceInfo;
}
