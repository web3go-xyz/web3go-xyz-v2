import { Module } from '@nestjs/common';

import { AccountInfoService } from './account-info.service';
import { AccountInfoController } from './account-info.controller';
import { Web3SignModule } from '../web3/web3.sign.module';
import { AccountBaseModule } from '../base/account-base.module';


@Module({
  imports: [
    AccountBaseModule,
    Web3SignModule
  ],
  controllers: [AccountInfoController],
  providers: [
    AccountInfoService
  ],
  exports: []
})
export class AccountInfoModule { }
