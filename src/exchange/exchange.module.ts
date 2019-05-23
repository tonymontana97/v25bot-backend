import { HttpModule, HttpService, Module } from '@nestjs/common';
import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';
import { AccountService } from '../account/account.service';
import { AccountModule } from '../account/account.module';

@Module({
  controllers: [ExchangeController],
  imports: [
    HttpModule,
    AccountModule,
  ],
  providers: [
    ExchangeService,
    AccountService,
  ],
})
export class ExchangeModule {}
