import { IsNumber, IsOptional, IsString } from 'class-validator';
import {
  ReviewLightingEnum,
  ReviewMoodEnum,
} from 'src/review_mood/review_mood.enum';
import { KeywordEtcSearchDto } from './keywordEtcSearch.dto';
import { ApiProperty } from '@nestjs/swagger';
type Participants = {
  min: number;
  max: number;
};

export class KeywordSearchDto {
  @ApiProperty({
    example: '{min: 4, max: 8}',
    description: '참석인원 범위',
    type: JSON,
  })
  @IsNumber()
  @IsOptional()
  participants: Participants;

  @ApiProperty({
    example: '3만 이상 5만 이하',
    description: '가격 범위',
    type: String,
  })
  @IsString()
  @IsOptional()
  price: string;

  @ApiProperty({
    example: 'Light',
    description: '분위기',
    type: ReviewMoodEnum,
  })
  @IsString()
  @IsOptional()
  mood: ReviewMoodEnum;

  @ApiProperty({
    example: 'Bright',
    description: '조명',
    type: ReviewLightingEnum,
  })
  @IsString()
  @IsOptional()
  lighting: ReviewLightingEnum;

  @ApiProperty({
    description: '기타 조건',
    type: KeywordEtcSearchDto,
  })
  etc: KeywordEtcSearchDto;
}
