import { Global, HttpModule, HttpService, Module } from '@nestjs/common';
import { ConfigurationService } from './configuration/configuration.service';
import { MapperService } from './mapper/mapper.service';
import { AuthService } from './auth/auth.service';
import { JwtStrategyService } from './auth/strategies/jwt-strategy/jwt-strategy.service';
import { UserModule } from '../user/user.module';

@Global()
@Module({
  imports: [
    UserModule,
    HttpModule,
  ],
  providers: [
    ConfigurationService,
    MapperService,
    AuthService,
    JwtStrategyService,
  ],
  exports: [
    ConfigurationService,
    MapperService,
    AuthService,
  ],
})
export class SharedModule {
}
