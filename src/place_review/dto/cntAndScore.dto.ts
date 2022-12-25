import { IsNumber, IsNotEmpty } from 'class-validator';

export class CntAndScoreDto {
  @IsNotEmpty()
  @IsNumber()
  cnt: number;

  @IsNotEmpty()
  @IsNumber()
  score: number;
}
