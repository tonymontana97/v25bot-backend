import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { ConfigurationService } from './shared/configuration/configuration.service';
import { EConfiguration } from './shared/configuration/configuration.enum';
import { UserModule } from './user/user.module';
import { AccountModule } from './account/account.module';
import { ExchangeModule } from './exchange/exchange.module';


@Module({
  imports: [
    SharedModule,
    MongooseModule.forRoot(
      ConfigurationService.connectionString,
      {
        useNewUrlParser: true,
      },
    ),
    UserModule,
    AccountModule,
    ExchangeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

  static host: string;
  static port: number | string;
  static isDev: boolean;

  constructor(
    private readonly _configurationService: ConfigurationService,
  ) {
    AppModule.port = AppModule.normalizePort(_configurationService.get(EConfiguration.PORT));
    AppModule.host = _configurationService.get(EConfiguration.HOST);
    AppModule.isDev = _configurationService.isDevelopment;
  }

  private static normalizePort(param: number | string): number | string {
    const portNumber: number = typeof param === 'string' ? parseInt(param, 10) : param;
    if (isNaN(portNumber)) {
      return param;
    } else if (portNumber >= 0) {
      return portNumber;
    }
  }
}
