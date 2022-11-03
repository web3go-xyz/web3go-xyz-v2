import { Module } from '@nestjs/common';

import { OrmModule } from 'src/base/orm/orm.module';
import { AccountBaseService } from './account-base.service';
import { VerifyCodeBaseService } from './verifycode-base.service';


@Module({
  imports: [
    OrmModule
  ],
  controllers: [],
  providers: [
    AccountBaseService,
    VerifyCodeBaseService,
  ],
  exports: [
    AccountBaseService,
    VerifyCodeBaseService,

  ]
})
export class AccountBaseModule { }
