import { Module } from '@nestjs/common';

import { databaseProviders_platform } from 'src/base/orm/database.provider.v2';
import repositoryProviders_platform from 'src/base/orm/repository.provider.v2/platform';
import { AccountBaseService } from './account-base.service';
import { VerifyCodeBaseService } from './verifycode-base.service';


@Module({
  imports: [

  ],
  controllers: [],
  providers: [
    ...databaseProviders_platform,
    ...repositoryProviders_platform,
    AccountBaseService,
    VerifyCodeBaseService,
  ],
  exports: [
    AccountBaseService,
    VerifyCodeBaseService,
    ...databaseProviders_platform,
    ...repositoryProviders_platform,
  ]
})
export class AccountBaseModule { }
