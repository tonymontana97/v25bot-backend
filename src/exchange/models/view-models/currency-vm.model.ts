import { ApiModelProperty } from '@nestjs/swagger';

export class CurrencyVmModel {
  @ApiModelProperty() name: string;
  @ApiModelProperty() code: string;
}
