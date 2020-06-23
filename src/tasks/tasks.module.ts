import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CarSchema } from '../cars/schemas/car.schema';
import { OwnerSchema } from '../owners/schemas/owner.schema';
import { ManufacturerSchema } from '../manufacturers/schemas/manufacturer.schema';
import { CarsService } from '../cars/cars.service';

@Module({
  imports:[MongooseModule.forFeature([{ name: 'Car', schema: CarSchema },
      { name: 'Owners', schema: OwnerSchema },
      { name: 'Manufacturer', schema: ManufacturerSchema }
    ])],
  providers: [TasksService,
    CarsService
  ],
})
export class TasksModule {}
