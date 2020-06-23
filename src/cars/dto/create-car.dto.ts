import {
  IsArray,
  IsDate,
  IsDateString,
  IsEmpty,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsObject,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IOwner } from '../../owners/interfaces/owner.interface';
import { IManufacturer } from '../../manufacturers/interfaces/manufacturer.interface';

export class CreateCarDto {
  @ApiProperty({
    description: 'The name of a car',
    default: 'CarName',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The manufacturer of a car',
    default: '5eea2b1210294f2ce8124ea9',
  })
  @IsObject()
  manufacturer;

  @ApiProperty({
    description: 'The price of a car',
    default: 20030,
  })

  @IsNumber()
  @Type(() => Number)
  @IsInt()
  price: number;

  @ApiProperty({
    description: 'The first registration date of a car',
    default: '2020-06-10T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  firstRegistrationDate: Date;

  @ApiProperty({
    description: 'The owners of a car',
    default: ['5eea2b1210294f2ce8124ea9', '5eea2b1210294f2ce8124ea8'],
  })
  @IsArray()
  @Type(() => Array)
  owners;
}
