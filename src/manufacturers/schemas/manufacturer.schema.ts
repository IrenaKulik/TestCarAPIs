import * as mongoose from 'mongoose';

export const ManufacturerSchema = new mongoose.Schema({
  name: String,
  phone: String,
  siret: Number
}, {
  toJSON: {
    versionKey: false,
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
    }
  }
});
