import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IManufacturer } from './interfaces/manufacturer.interface';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';

@Injectable()
export class ManufacturersService {
  constructor(@InjectModel('Manufacturer') private readonly manufacturerModel: Model<IManufacturer>) { }

  async findAllManufacturers(): Promise<IManufacturer[]> {
    return this.manufacturerModel.find().exec();
  }

  async findManufacturerById(id: string): Promise<IManufacturer> {
    return this.manufacturerModel.findById(id).exec();
  }

  async createManufacturer(createManufacturerDto: CreateManufacturerDto): Promise<IManufacturer> {
    const manufacturer = new this.manufacturerModel(createManufacturerDto);
    return manufacturer.save();
  }

  async updateManufacturer(id: string, createManufacturerDto: CreateManufacturerDto): Promise<IManufacturer> {
    return this.manufacturerModel.findByIdAndUpdate(id, createManufacturerDto, {new: true}).exec();
  }

  async deleteManufacturer(id: string): Promise<any> {
    return this.manufacturerModel.findByIdAndDelete(id).exec();
  }
}
