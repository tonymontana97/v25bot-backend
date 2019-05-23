import { SchemaOptions } from 'mongoose';
import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { Typegoose, prop, pre } from 'typegoose';

export class BaseModelVm {
  @ApiModelPropertyOptional({ type: String, format: 'date-time' })
  createdAt?: Date;

  @ApiModelPropertyOptional({ type: String, format: 'date-time' })
  updatedAt?: Date;

  @ApiModelPropertyOptional()
  id?: string;
}

@pre('findOneAndUpdate', function() {
  this._update.updatedAt = new Date(Date.now());
})
export abstract class BaseModel<T> extends Typegoose {
  @prop({ default: Date.now() })
  createdAt?: Date;

  @prop({ default: Date.now() })
  updatedAt?: Date;

  @ApiModelPropertyOptional()
  id?: string;
}

export const schemaOptions: SchemaOptions = {
  toJSON: {
    virtuals: true,
    getters: true,
  },
};
