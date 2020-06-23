import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateManufacturerDto {
  @ApiProperty({
    description: 'The name of a manufacturer',
    default: 'Manufacturer'
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The phone of a manufacturer',
    default: '76335288462'
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'The siret of a manufacturer',
    default: 23723842824
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @IsInt()
  siret: number;
}
