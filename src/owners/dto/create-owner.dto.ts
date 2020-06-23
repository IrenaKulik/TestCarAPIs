import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOwnerDto {
  @ApiProperty({
    description: 'The name of a owner',
    default: 'Tim'
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The purchase date of a owner',
    default: '2020-06-10T00:00:00.000Z'
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  purchaseDate: Date;
}
