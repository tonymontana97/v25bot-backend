import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Account } from './models/account.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: Account.modelName, schema: Account.model.schema }])],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
