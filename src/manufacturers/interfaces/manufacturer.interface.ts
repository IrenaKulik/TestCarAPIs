import { Document } from 'mongoose';

export interface IManufacturer extends Document {
  id: string;
  name: string;
  phone: string;
  siret: number;
}
