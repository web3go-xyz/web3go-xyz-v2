import { Module } from '@nestjs/common';

import { AccountInfoService } from './account-info.service';
import { AccountInfoController } from './account-info.controller';
import { Web3SignModule } from '../web3/web3.sign.module';
import { AccountBaseModule } from '../base/account-base.module';
import { EmailBaseModule } from 'src/base/email/email-base.module';
import { JWTAuthModule } from 'src/base/auth/jwt-auth.module'; 
import { PlatformOrmModule } from 'src/base/orm/platoform.orm.module';


@Module({
  imports: [
    PlatformOrmModule,
    AccountBaseModule,
    Web3SignModule,
    EmailBaseModule,
    JWTAuthModule
  ],
  controllers: [AccountInfoController],
  providers: [
    AccountInfoService
  ],
  exports: []
})
export class AccountInfoModule { }
