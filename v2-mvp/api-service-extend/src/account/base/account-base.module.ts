import { Module } from '@nestjs/common';
 
import { PlatformOrmModule } from 'src/base/orm/platoform.orm.module';
import { AccountBaseService } from './account-base.service';
import { VerifyCodeBaseService } from './verifycode-base.service';


@Module({
  imports: [
    PlatformOrmModule
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
