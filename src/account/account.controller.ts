import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Account } from './models/account.model';
import { AccountService } from './account.service';
import { AccountVmModel } from './models/view-models/account-vm.model';
import { ApiException } from '../shared/api-exception.model';
import { GetOperationId } from '../shared/utilities/get-operation-id';
import { AccountParamsModel } from './models/view-models/account-params.model';
import { isArray, map } from 'lodash';
import { AuthGuard } from '@nestjs/passport';

@Controller('accounts')
@ApiBearerAuth()
@ApiUseTags(Account.modelName)
export class AccountController {
  constructor(
    private readonly _accountService: AccountService,
  ) {
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.CREATED, type: AccountVmModel })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  @ApiOperation(GetOperationId(Account.modelName, 'Create'))
  async create(@Body() params: AccountParamsModel, @Req() req): Promise<AccountVmModel> {
    const { name, secretKey } = params;

    if (!name) {
      throw new HttpException('Name is requred', HttpStatus.BAD_REQUEST);
    }

    if (!secretKey) {
      throw new HttpException('Secret key is requred', HttpStatus.BAD_REQUEST);
    }

    try {
      const newAccount = await this._accountService.createAccount(params, req.user._id);
      return this._accountService.map<AccountVmModel>(newAccount);
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK, type: AccountVmModel, isArray: true })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  @ApiOperation(GetOperationId(Account.modelName, 'GetAll'))
  async get(@Req() req): Promise<Account[]> {
    try {
      const filter = {
        owner: req.user._id,
      };
      const accounts = await this._accountService.findAll(filter);
      return this._accountService.map<Account[]>(map(accounts, account => account.toJSON()));
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.CREATED, type: AccountVmModel })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  @ApiOperation(GetOperationId(Account.modelName, 'Update'))
  async update(@Body() vm: AccountVmModel, @Req() req): Promise<AccountVmModel> {
    const { id, name, secretKey, secretId } = vm;

    if (!id) {
      throw new HttpException('Id is requred', HttpStatus.BAD_REQUEST);
    }

    if (!name) {
      throw new HttpException('Name is requred', HttpStatus.BAD_REQUEST);
    }

    if (!secretKey) {
      throw new HttpException('Secret key is requred', HttpStatus.BAD_REQUEST);
    }

    if (!secretId) {
      throw new HttpException('Secret id is requred', HttpStatus.BAD_REQUEST);
    }

    const exists = await this._accountService.findById(id);

    if (exists.owner.toString() !== req.user._id.toString()) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }

    if (!exists) {
      throw new HttpException(`Account with id: ${id} not found`, HttpStatus.NOT_FOUND);
    }

    exists.secretKey = secretKey;
    exists.secretId = secretId;
    exists.name = name;

    try {
      const updated = await this._accountService.update(id, exists);
      return this._accountService.map<AccountVmModel>(updated);
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK, type: AccountVmModel })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  @ApiOperation(GetOperationId(Account.modelName, 'Delete'))
  async delete(@Param('id') id: string, @Req() req): Promise<AccountVmModel> {
    const exists = await this._accountService.findById(id);

    if (exists && exists.owner && exists.owner.toString() !== req.user._id.toString()) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }

    try {
      const deleted = await this._accountService.delete(id);
      return this._accountService.map<AccountVmModel>(deleted.toJSON());
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
