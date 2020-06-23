import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { OwnersController } from '../owners/owners.controller';
import { OwnersService } from '../owners/owners.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICar } from '../cars/interfaces/car.interface';
import { IOwner } from '../owners/interfaces/owner.interface';
import { CarsService } from '../cars/cars.service';
import { IManufacturer } from '../manufacturers/interfaces/manufacturer.interface';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
              private carsService: CarsService,
               @InjectModel('Car') private readonly carModel: Model<ICar>,
    @InjectModel('Owners') private readonly ownerModel: Model<IOwner>,
    @InjectModel('Manufacturer') private readonly manufacturerModel: Model<IManufacturer>
  ) { }


  @Cron('0 0 1 * *')
  handleCron() {
    this.carsService.getDiscount().then();
    this.carsService.deleteOwners().then();
    this.logger.debug('Called every month');
  }

  @Timeout(10000)
  handleTimeout() {
    this.carsService.getDiscount().then();
    this.carsService.deleteOwners().then();
    this.logger.debug('Called once after 10 seconds');
    this.logger.debug('Automatically remove the owners who bought their cars before the last 18 months and apply a discount of 20% to all cars having a date of first registration between 12 and 18 months.');
  }
}
