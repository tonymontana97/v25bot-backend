import { BaseModel, schemaOptions } from '../../shared/base.model';
import { EUserRole } from './user-role.enum';
import { ModelType, prop } from 'typegoose';

export const USER_MODEL = 'User';

export class User extends BaseModel<User> {
  @prop({
    required: [true, 'This field is required'],
    minlength: [6, 'At least 6 charsets'],
    unique: true,
  })
  username: string;

  @prop({
    required: [true, 'req'],
    minlength: [6, 'at leaset 6 charsets'],
  })
  password: string;

  @prop({
    enum: EUserRole,
    default: EUserRole.User,
  })
  role: EUserRole;

  static get model(): ModelType<User> {
    return new User().getModelForClass(User, { schemaOptions });
  }

  static get modelName(): string {
    return this.model.modelName;
  }
}
