import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { CarSchema } from './schemas/car.schema';
import { ManufacturerSchema } from '../manufacturers/schemas/manufacturer.schema';
import { OwnerSchema } from '../owners/schemas/owner.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Car', schema: CarSchema },
      { name: 'Owners', schema: OwnerSchema },
      { name: 'Manufacturer', schema: ManufacturerSchema }
    ])
  ],
  controllers: [CarsController],
  providers: [CarsService]
})

export class CarsModule { }
