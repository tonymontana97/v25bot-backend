import { BaseModelVm } from '../../../shared/base.model';
import { ApiModelProperty } from '@nestjs/swagger';

export class AccountVmModel extends BaseModelVm {
  @ApiModelProperty() name: string;
  @ApiModelProperty() secretId: string;
  @ApiModelProperty() secretKey: string;
}
