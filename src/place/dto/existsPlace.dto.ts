import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ExistsPlace {
  @ApiProperty({
    example: '014da8aa-123c-491c-8574-1c84087ec9b4',
    description: 'uuid',
  })
  @IsNotEmpty()
  @IsString()
  id: string;
}
