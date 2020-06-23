import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OwnersService } from './owners.service';
import { OwnersController } from './owners.controller';
import { OwnerSchema } from './schemas/owner.schema';
import { CarSchema } from '../cars/schemas/car.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Owner', schema: OwnerSchema },
    { name: 'Car', schema: CarSchema }])],
  controllers: [OwnersController],
  providers: [OwnersService]
})

export class OwnersModule { }
