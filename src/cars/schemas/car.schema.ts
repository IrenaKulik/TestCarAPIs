import * as mongoose from 'mongoose';

export const CarSchema = new mongoose.Schema({
  name: String,
  manufacturer: { type: mongoose.Schema.Types.ObjectId, ref: 'ManufacturerSchema' },
  price: Number,
  firstRegistrationDate: { type: Date, default: Date.now },
  owners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OwnerSchema' }]
}, {
  toJSON: {
    versionKey: false,
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
    }
  }
});




