import { Module } from '@nestjs/common';

import { AccountAuthService } from './account-auth.service';
import { AccountAuthController } from './account-auth.controller';
import { AccountBaseModule } from '../base/account-base.module';
import { JWTAuthModule } from 'src/base/auth/jwt-auth.module';
import { EmailBaseModule } from 'src/base/email/email-base.module';
import { OrmModule } from 'src/base/orm/orm.module';



@Module({
  imports: [
    OrmModule,
    AccountBaseModule,
    JWTAuthModule,
    EmailBaseModule
  ],
  controllers: [AccountAuthController],
  providers: [
    AccountAuthService
  ],
  exports: []
})
export class AccountAuthModule { }
