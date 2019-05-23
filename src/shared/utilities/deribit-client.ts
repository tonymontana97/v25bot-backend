import { HttpException, HttpService, HttpStatus, Inject } from '@nestjs/common';
import { ConfigurationService } from '../configuration/configuration.service';
import { routes } from '../../exchange/exchange.service';

export interface IDeribitResponse {
  data: string;
}

export interface IDeribitAuthParams {
  clientId: string;
  clientSecret: string;
}

export interface IDeribitOrderParams {
  instrument_name: string;
  amount: number;
  type?: EDeribitOrderType;
  label?: string;
  price?: number;
  timeInForce?: EDeribitTimeToForce;
  maxShow?: number;
  postOnly?: boolean;
  reduceOnly?: boolean;
  stopPrice?: number;
  trigger?: EDeribitTrigger;
  advanced?: EDeribitAdvanced;
}

export enum EDeribitOrderType {
  LIMIT = 'limit',
  STOP_LIMIT = 'stop_limit',
  MARKET = 'market',
  STOP_MARKET = 'stop_market',
}

export enum EDeribitTimeToForce {
  GOOD_TIL_CANCELLED = 'good_til_cancelled',
  FILL_OR_KILL = 'fill_or_kill',
  IMMEDIATE_OR_CANCEL = 'immediate_or_cancel',
}

export enum EDeribitTrigger {
  INDEX_PRICE = 'index_price',
  MARK_PRICE = 'mark_price',
  LAST_PRICE = 'last_price',
}

export enum EDeribitAdvanced {
  USD = 'usd',
  IMPLV = 'implv',
}

export enum EDeribitHosts {
  DEV_MODE = 'https://test.deribit.com/api/v2',
  PROD_MODE = 'https://deribit.com/api/v2',
}

export const endpoints = {
  auth: () => `/public/auth`,
  getUserTradesByInstrument: () => `/private/get_user_trades_by_instrument`,
  getAccountSummary: () => `/private/get_account_summary`,
  getOpenOrdersByCurrency: () => `/private/get_open_orders_by_currency`,
  buy: () => '/private/buy',
  sell: () => '/private/sell',
};

export class DeribitClient {
  private readonly httpService: HttpService = new HttpService();
  private readonly configurationService: ConfigurationService = new ConfigurationService();
  private token: string;

  public setToken(token: string): DeribitClient {
    this.token = token;
    return this;
  }

  public get host(): string {
    const isDev = this.configurationService.isDevelopment;
    return isDev ? EDeribitHosts.DEV_MODE : EDeribitHosts.PROD_MODE;
  }

  public async auth(data: IDeribitAuthParams): Promise<IDeribitResponse> {
    return await this.request(routes.auth(), {
      grant_type: 'client_credentials',
      client_id: data.clientId,
      client_secret: data.clientSecret,
      scope: 'session:v25bot expires:86400',
    });
  }

  public async getUserTradesByInstrument(instrumentName: string): Promise<IDeribitResponse> {
    return await this.request(endpoints.getUserTradesByInstrument(), {
      instrument_name: instrumentName,
    });
  }

  public async getOpenOrdersByCurrency(currency: string): Promise<IDeribitResponse> {
    return await this.request(endpoints.getOpenOrdersByCurrency(), {
      currency,
    });
  }

  public async buy(params: IDeribitOrderParams): Promise<IDeribitResponse> {
    return await this.request(endpoints.buy(), params);
  }

  public async sell(params: IDeribitOrderParams): Promise<IDeribitResponse> {
    return await this.request(endpoints.sell(), params);
  }

  private async request(url: string, params): Promise<any> {
    return await this.httpService.get(this.host + url, {
      params,
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    }).toPromise().catch((e) => {
      throw new HttpException(e.response.data, HttpStatus.BAD_REQUEST);
    });
  }

}
