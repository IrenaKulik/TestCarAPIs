import * as mongoose from 'mongoose';

export const OwnerSchema = new mongoose.Schema({
  name: String,
  purchaseDate: { type: Date, default: Date.now },
}, {
  toJSON: {
    versionKey: false,
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
    },
  },
});
