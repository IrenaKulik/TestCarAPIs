import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import * as mongoose from 'mongoose';

// Checking the parameter id is mongoDB ObjectId
@Injectable()
export class ValidateObjectId implements PipeTransform<string> {
  async transform(id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid)
      throw new BadRequestException('Invalid Id!');
    return id;
  }
}
