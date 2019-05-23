import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '../../auth.service';
import { ConfigurationService } from '../../../configuration/configuration.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { EConfiguration } from '../../../configuration/configuration.enum';
import { IjwtPayload } from '../../jwt-payload';

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy) {
  constructor(
    private readonly _authService: AuthService,
    private readonly _configurationService: ConfigurationService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _configurationService.get(EConfiguration.JWT_KEY),
    });
  }

  async validate(payload: IjwtPayload, done: VerifiedCallback) {
    const user = await this._authService.validatePayload(payload);

    if (!user) {
      return done(new HttpException({}, HttpStatus.UNAUTHORIZED), false);
    }

    return done(null, user, payload.iat);
  }
}
