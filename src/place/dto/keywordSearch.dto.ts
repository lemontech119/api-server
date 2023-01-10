import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  ReviewLightingEnum,
  ReviewMoodEnum,
  ReviewPraisedEnum,
} from 'src/review_mood/review_mood.enum';
import { KeywordEtcSearchDto } from './keywordEtcSearch.dto';

type Participants = {
  min: number;
  max: number;
};

export class KeywordSearchDto {
  @IsNumber()
  @IsOptional()
  participants: Participants;

  @IsString()
  @IsOptional()
  price: string;

  @IsString()
  @IsOptional()
  mood: ReviewMoodEnum;

  @IsString()
  @IsOptional()
  lighting: ReviewLightingEnum;

  @IsString()
  @IsOptional()
  praised: ReviewPraisedEnum;

  etc: KeywordEtcSearchDto;
}
