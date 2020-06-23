import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OwnersModule } from './owners/owners.module';
import { CarsModule } from './cars/cars.module';
import { ManufacturersModule } from './manufacturers/manufacturers.module';
import { TasksModule } from './tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SERVER_CONFIG } from './server.constants';

@Module({
  imports: [
    MongooseModule.forRoot(SERVER_CONFIG.db,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
      }
    ),
    OwnersModule,
    CarsModule,
    ManufacturersModule,
    ScheduleModule.forRoot(),
    TasksModule,
  ],
  providers: [],
  controllers: []
})
export class AppModule { }

