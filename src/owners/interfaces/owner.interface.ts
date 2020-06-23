import { Document } from 'mongoose';

export interface IOwner extends Document {
  id: string;
  name: string;
  purchaseDate: Date;
}
