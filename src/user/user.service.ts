import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { User } from './models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { ModelType } from 'typegoose';
import { MapperService } from '../shared/mapper/mapper.service';
import { RegisterVmModel } from './models/view-models/register-vm.model';
import { getSalt, hash, compare } from 'bcryptjs';
import { LoginVmModel } from './models/view-models/login-vm.model';
import { LoginResponseVmModel } from './models/view-models/login-response-vm.model';
import { IjwtPayload } from '../shared/auth/jwt-payload';
import { AuthService } from '../shared/auth/auth.service';
import { UserVmModel } from './models/view-models/user-vm.model';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectModel(User.modelName) private readonly _userModel: ModelType<User>,
    private readonly _mapperService: MapperService,
    @Inject(forwardRef(() => AuthService))
    readonly _authService: AuthService,
  ) {
    super();
    this.model = _userModel;
    this.mapper = _mapperService.mapper;
  }

  async register(registerVm: RegisterVmModel) {
    const { username, password } = registerVm;
    const newUser = new this.model(); // instance type of <User>
    newUser.username = username;
    newUser.password = await hash(password, 10);

    try {
      const result = await this.create(newUser);
      return result.toJSON() as User;
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(loginVm: LoginVmModel): Promise<LoginResponseVmModel> {
    const { username, password } = loginVm;

    const user = await this.findOne({ username });

    if (!user) {
      throw new HttpException('Invalid credentails', HttpStatus.BAD_REQUEST);
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      throw new HttpException('Password is incorrect', HttpStatus.BAD_REQUEST);
    }

    const payload: IjwtPayload = {
      username: user.username,
      id: user.id,
      role: user.role,
    };

    const token = await this._authService.signPayload(payload);
    const userVm: UserVmModel = await this.map<UserVmModel>(user.toJSON());

    return {
      token,
      user: userVm,
    };
  }
}
