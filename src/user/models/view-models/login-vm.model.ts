import { ApiModelProperty } from '@nestjs/swagger';

export class LoginVmModel {
  @ApiModelProperty() username: string;
  @ApiModelProperty() password: string;
}
