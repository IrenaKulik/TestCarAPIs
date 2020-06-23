import { Injectable, Get } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { IOwner } from './interfaces/owner.interface';

@Injectable()
export class OwnersService {
  constructor(@InjectModel('Owner') private ownerModel: Model<IOwner>) { }

  async findAllOwners(): Promise<IOwner[]> {
    return this.ownerModel.find().exec();
  }

  async findOwnerById(id: string): Promise<IOwner> {
    return this.ownerModel.findById(id).exec();
  }

  async createOwner(createOwnerDto: CreateOwnerDto): Promise<IOwner> {
    const owner = new this.ownerModel(createOwnerDto);
    return owner.save();
  }

  async updateOwner(id: string, createOwnerDto: CreateOwnerDto): Promise<IOwner> {
    return this.ownerModel.findByIdAndUpdate(id, createOwnerDto, { new: true }).exec();
  }

  async deleteOwner(id: string): Promise<any> {
    return this.ownerModel.findByIdAndDelete(id).exec();
  }
}
