import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ApiException } from '../shared/api-exception.model';
import { CurrencyVmModel } from './models/view-models/currency-vm.model';
import { AuthGuard } from '@nestjs/passport';
import { ExchangeService } from './exchange.service';
import { InstrumentVmModel } from './models/view-models/instrument-vm.model';
import { InstrumentsParamsModel } from './models/view-models/instruments-params.model';
import { response } from 'express';
import { InstrumentTradesVmModel } from './models/view-models/instrument-trades-vm.model';
import { AuthAccountParamsModel } from './models/view-models/auth-account-params.model';
import { AccountService } from '../account/account.service';
import { AuthAccountVmModel } from './models/view-models/auth-account-vm.model';
import { TradesUserByInstrumentParamsModel } from './models/view-models/trades-user-by-instrument-params.model';
import { DeribitClient, IDeribitOrderParams } from '../shared/utilities/deribit-client';
import { AxiosResponse } from 'axios';

@Controller('exchanges')
@ApiBearerAuth()
@ApiUseTags('Exchage')
export class ExchangeController {
  private deribitClient = new DeribitClient();

  constructor(
    private readonly _exchangeService: ExchangeService,
    private readonly _accountService: AccountService,
  ) {
  }

  @Get('/currencies')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK, type: CurrencyVmModel })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  async getCurrencies(): Promise<CurrencyVmModel[]> {
    let currencies = [];
    await this._exchangeService.getCurrencies().then((response) => {
      currencies = [...response.data.result];
    });

    return new Promise((resolve, reject) => {
      resolve(currencies.map((currency) => {
        return {
          name: currency.currency_long,
          code: currency.currency,
        };
      }));
    });
  }

  @Get('/instruments/:name')
  // @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK, type: CurrencyVmModel })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  async getInstruments(@Param('name') name: string): Promise<InstrumentVmModel[]> {
    let instruments = [];

    await this._exchangeService.getInstruments(name).then((response) => {
      instruments = [...response.data.result];
    });

    return new Promise((resolve, reject) => {
      resolve(instruments);
    });
  }

  // TODO: add filtering by user id and account id
  @Post('/auth')
  @ApiResponse({ status: HttpStatus.OK, type: AuthAccountVmModel })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  async auth(@Body() body: AuthAccountParamsModel): Promise<any> {
    const account = await this._accountService.findById(body.accountId);

    if (!account) {
      throw new HttpException('Account do not exists', HttpStatus.NOT_FOUND);
    }

    const token = await this.deribitClient.auth({ clientSecret: account.secretKey, clientId: account.secretId });
    if (!token) {
      throw new HttpException('Exchange error side', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return token.data;
  }

  @Get('/trades/:instrumentName')
  @ApiResponse({ status: HttpStatus.OK, type: InstrumentTradesVmModel })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  async getUserTradesByInstrument(
    @Param('instrumentName') instrumentName: string,
    @Req() req,
    @Body() vm: TradesUserByInstrumentParamsModel,
  ) {
    const data = await this.deribitClient.setToken(req.headers['x-api-key']).getUserTradesByInstrument(instrumentName);

    if (!data) {
      throw new HttpException('Exchange error side', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return data.data;
  }

  @Get('/orders/:currency')
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  async getOpenOrdersByCurrency(
    @Param('currency') currency: string,
    @Req() req,
  ) {
    const data = await this.deribitClient.setToken(req.headers['x-api-key']).getOpenOrdersByCurrency(currency);
    if (!data) {
      throw new HttpException('Exchange error side', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return data.data;
  }

  @Post('/buy')
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  async buy(
    @Body() body: IDeribitOrderParams,
    @Req() req,
  ) {
    const data = await this.deribitClient.setToken(req.headers['x-api-key']).buy(body);
    if (!data) {
      throw new HttpException('Exchange error side', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return data.data;
  }

  @Post('/sell')
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  async sell(
    @Body() body: IDeribitOrderParams,
    @Req() req,
  ) {
    const data = await this.deribitClient.setToken(req.headers['x-api-key']).sell(body);
    if (!data) {
      throw new HttpException('Exchange error side', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return data.data;
  }
}
