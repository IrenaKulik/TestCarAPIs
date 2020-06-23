import { Module } from '@nestjs/common';
import { ManufacturersController } from './manufacturers.controller';
import { ManufacturersService } from './manufacturers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ManufacturerSchema } from './schemas/manufacturer.schema';

@Module({
   imports: [
    MongooseModule.forFeature([{name: 'Manufacturer', schema: ManufacturerSchema}])
  ],
  controllers: [ManufacturersController],
  providers: [ManufacturersService]
})
export class ManufacturersModule {}
