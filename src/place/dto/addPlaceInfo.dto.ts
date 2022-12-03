import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddPlaceInfo {
  @IsString()
  url: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsString()
  roadAddress: string;
}
