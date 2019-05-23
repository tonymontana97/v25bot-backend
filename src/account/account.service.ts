import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { Account } from './models/account.model';
import { ModelType } from 'typegoose';
import { MapperService } from '../shared/mapper/mapper.service';
import { InjectModel } from '@nestjs/mongoose';
import { AccountParamsModel } from './models/view-models/account-params.model';

@Injectable()
export class AccountService extends BaseService<Account> {
  constructor(
    @InjectModel(Account.modelName) private readonly _accountModel: ModelType<Account>,
    private readonly _mapperService: MapperService,
  ) {
    super();
    this.model = _accountModel;
    this.mapper = _mapperService.mapper;
  }

  async createAccount(params: AccountParamsModel, userId: string): Promise<Account> {
    const { name, secretKey, secretId } = params;

    const newAccount = new this.model();
    newAccount.name = name;
    newAccount.secretId = secretId;
    newAccount.secretKey = secretKey;
    newAccount.owner = userId;

    try {
      const result = await this.create(newAccount);
      return result.toJSON() as Account;
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
