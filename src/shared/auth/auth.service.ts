import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { sign, SignOptions } from 'jsonwebtoken';
import { UserService } from '../../user/user.service';
import { ConfigurationService } from '../configuration/configuration.service';
import { EConfiguration } from '../configuration/configuration.enum';
import { IjwtPayload } from './jwt-payload';
import { User } from '../../user/models/user.model';

@Injectable()
export class AuthService {
  private readonly jwtOptions: SignOptions;
  private readonly jwtKey: string;

  constructor(
    @Inject(forwardRef(() => UserService))
    readonly _userService: UserService,
    private readonly _configurationService: ConfigurationService,
  ) {
    this.jwtOptions = { expiresIn: '12h' };
    this.jwtKey = _configurationService.get(EConfiguration.JWT_KEY);
  }

  async signPayload(payload: IjwtPayload): Promise<string> {
    return sign(payload, this.jwtKey, this.jwtOptions);
  }

  async validatePayload(payload: IjwtPayload): Promise<User> {
    return this._userService.findOne({ username: payload.username.toLowerCase() });
  }
}
