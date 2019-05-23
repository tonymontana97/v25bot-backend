import { HttpException, HttpService, Injectable } from '@nestjs/common';
import { ConfigurationService } from '../shared/configuration/configuration.service';
import * as crypto from 'crypto-js';
import { AxiosError } from 'axios';
import { createHmac } from 'crypto';

export const routes = {
  getCurrencies: () => `/public/get_currencies`,
  getInstruments: () => `/public/get_instruments`,
  getUserTradesByInstrument: () => `/private/get_account_summary`,
  auth: () => `/public/auth`,
};


@Injectable()
export class ExchangeService {
  constructor(
    private readonly _httService: HttpService,
    private readonly _configurationService: ConfigurationService,
  ) {
  }

  public get url(): string {
    return this._configurationService.isDevelopment ? 'https://test.deribit.com/api/v2' : 'https://deribit.com/api/v2';
  }

  auth(clientId: string, clientSecret: string): Promise<any> {
    return this._httService.get(this.url + routes.auth(), {
      params: {
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        scope: 'session:v25bot',
      },
    }).toPromise();
  }

  getCurrencies(): Promise<any> {
    return this._httService.get(`${this.url}${routes.getCurrencies()}`).toPromise();
  }

  getInstruments(name: string): Promise<any> {
    return this._httService.get(`${this.url}${routes.getInstruments()}`, {
      params: {
        currency: name,
      },
    }).toPromise();
  }

  async getUserTradesByInstrument(name: string, access: { secretId: string, secretKey: string }): Promise<any> {
    const token = await this.auth(access.secretId, access.secretKey);
    console.log(token);

    return this._httService.get(this.url + routes.getUserTradesByInstrument(), {
      headers: {
        'Authorization': `Bearer ${token.data.result.access_token}`,
      },
      params: {
        currency: 'BTC',
      },
    }).toPromise().catch((e: AxiosError) => {
      console.log(e.response.data);
    });
  }

}
