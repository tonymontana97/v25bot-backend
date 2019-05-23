import { ApiModelProperty } from '@nestjs/swagger';

export class AccountParamsModel {
  @ApiModelProperty() name: string;
  @ApiModelProperty() secretId: string;
  @ApiModelProperty() secretKey: string;
}
