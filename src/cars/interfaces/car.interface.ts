import { Document } from 'mongoose';
import { IManufacturer } from '../../manufacturers/interfaces/manufacturer.interface';
import { IOwner } from '../../owners/interfaces/owner.interface';

export interface ICar extends Document {
  id: string;
  name: string;
  manufacturer: IManufacturer;
  price: number;
  firstRegistrationDate: Date;
  owners: [IOwner]
}


