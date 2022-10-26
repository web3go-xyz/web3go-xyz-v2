import { Module } from '@nestjs/common';

import { AccountAuthService } from './account-auth.service';
import { AccountAuthController } from './account-auth.controller';
import { AccountBaseModule } from '../base/account-base.module';
 


@Module({
  imports: [
    AccountBaseModule
  ],
  controllers: [AccountAuthController],
  providers: [ 
    AccountAuthService
  ],
  exports: []
})
export class AccountAuthModule { }
