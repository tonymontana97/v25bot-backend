import { BaseModel, schemaOptions } from '../../shared/base.model';
import { ModelType, prop } from 'typegoose';

export class Account extends BaseModel<Account> {
  @prop({ required: [true, 'Name is required'] })
  name: string;

  @prop({ required: [true, 'Secret id is required'] })
  secretId: string;

  @prop({ required: [true, 'Secret key is required'] })
  secretKey: string;

  @prop({ ref: 'User', required: true })
  owner: string;

  static get model(): ModelType<Account> {
    return new Account().getModelForClass(Account, { schemaOptions });
  }

  static get modelName(): string {
    return this.model.modelName;
  }
}
