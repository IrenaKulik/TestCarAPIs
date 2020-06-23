import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICar } from './interfaces/car.interface';
import { CreateCarDto } from './dto/create-car.dto';
import { IManufacturer } from '../manufacturers/interfaces/manufacturer.interface';
import { IOwner } from '../owners/interfaces/owner.interface';
import * as mongoose from 'mongoose';

@Injectable()
export class CarsService {
  constructor(
    @InjectModel('Car') private readonly carModel: Model<ICar>,
    @InjectModel('Owners') private readonly ownerModel: Model<IOwner>,
    @InjectModel('Manufacturer') private readonly manufacturerModel: Model<IManufacturer>
  ) { }

  async findAllCars(): Promise<ICar[]> {
    return this.carModel.find().populate({ path: 'owners', model: this.ownerModel })
      .populate({ path: 'manufacturer', model: this.manufacturerModel }).exec();
  }

  async findCarById(id: string): Promise<ICar> {
    return this.carModel.findById(id).populate({ path: 'owners', model: this.ownerModel })
      .populate({ path: 'manufacturer', model: this.manufacturerModel }).exec();
  }

  async findCarManufacturer(id: string): Promise<any> {
    const car = await this.carModel.findOne({'_id': id})
      .populate({ path: 'manufacturer', model: this.manufacturerModel }).exec();
    return car? car.manufacturer : {}
  }

  async createCar(createCarDto: CreateCarDto): Promise<ICar> {
    const createdCar = new this.carModel(createCarDto);
    return createdCar.save();
  }

  async updateCar(id: string, createCarDto: CreateCarDto): Promise<ICar> {
    return await this.carModel.findByIdAndUpdate(id, createCarDto, {new: true}).exec();
  }

  async deleteCar(id: string): Promise<any> {
    return await this.carModel.findByIdAndDelete({ '_id': id }).exec();
  }

  // Add a discount of 20% to all cars having a date of first registration between 12 and 18 months
  async getDiscount(): Promise<any> {
    const today = new Date();
    const startInterval = new Date(today.setMonth(today.getMonth() - 18));
    const endInterval = new Date(today.setMonth(today.getMonth() + 6));
    return this.carModel.updateMany({ 'firstRegistrationDate': { "$gte": startInterval, '$lte': endInterval } },
      { '$mul': { price: 0.8 } }, { new: true }).exec()
  }

  // Remove the owners who bought their cars before the last 18 months
  async deleteOwners(): Promise<any> {
    const today = new Date();
    return this.ownerModel
      .find({ 'purchaseDate': { '$lt': new Date(today.setMonth(today.getMonth() - 18)) } })
      .then(async owners => {
        if (owners) {
          const ids = owners.map(owner => owner._id.toString());
          await this.carModel.find({ owners: { '$in': ids } }).then(async cars => {
            if (cars) {
              cars.map(car => {
                car.owners = car.owners.filter(owner => !~ids.indexOf(owner.toString())) as [IOwner];
                car.owners.map(owner => mongoose.Types.ObjectId(owner.toString()));
                return this.carModel.updateOne({ '_id': car._id }, { '$set': { 'owners': car.owners } });
              });
            }
            return cars;
          });
          await this.ownerModel.deleteMany({ '_id': { '$in': ids } }).exec()
        }
        return owners;
      });
  }
}
