import { BaseModelVm } from '../../../shared/base.model';
import { EUserRole } from '../user-role.enum';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { EnumToArray } from '../../../shared/utilities/enum-to-array';

export class UserVmModel extends BaseModelVm {
  @ApiModelProperty()
  username: string;
  @ApiModelPropertyOptional({ enum: EnumToArray(EUserRole) })
  role?: EUserRole;
}
