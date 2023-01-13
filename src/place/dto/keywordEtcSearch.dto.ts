import { IsBoolean } from 'class-validator';

export class KeywordEtcSearchDto {
  @IsBoolean()
  is_cork_charge = false;

  @IsBoolean()
  is_rent = false;

  @IsBoolean()
  is_room = false;

  @IsBoolean()
  is_reservation = false;

  @IsBoolean()
  is_parking = false;

  @IsBoolean()
  is_advance_payment = false;
}
