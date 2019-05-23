import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { User } from './models/user.model';
import { ApiUseTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { RegisterVmModel } from './models/view-models/register-vm.model';
import { UserVmModel } from './models/view-models/user-vm.model';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ApiException } from '../shared/api-exception.model';
import { GetOperationId } from '../shared/utilities/get-operation-id';
import { LoginResponseVmModel } from './models/view-models/login-response-vm.model';
import { LoginVmModel } from './models/view-models/login-vm.model';

@Controller('users')
@ApiUseTags(User.modelName)
export class UserController {
  constructor(
    private readonly _userService: UserService,
  ) {
  }

  @Post('register')
  @ApiResponse({ status: HttpStatus.CREATED, type: UserVmModel })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  @ApiOperation(GetOperationId(User.modelName, 'Register'))
  async register(@Body() registerVm: RegisterVmModel): Promise<UserVmModel> {
    const { username, password } = registerVm;

    const newUser = await this._userService.register(registerVm);
    return this._userService.map<UserVmModel>(newUser);
  }

  @Post('login')
  @ApiResponse({ status: HttpStatus.CREATED, type: LoginResponseVmModel })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  @ApiOperation(GetOperationId(User.modelName, 'Login'))
  async login(@Body() loginVm: LoginVmModel): Promise<LoginResponseVmModel> {

    return this._userService.login(loginVm);
  }
}
