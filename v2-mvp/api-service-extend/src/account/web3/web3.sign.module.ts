import { Module } from '@nestjs/common';


import { Web3SignController } from './web3.sign.controller';
import { Web3SignService } from './web3.sign.service';
import { PolkadotSignHelper } from 'src/base/web3/sign/polkadot/polkadot.sign.helper';
import { MetamaskSignHelper } from 'src/base/web3/sign/metamask/metamask.sign.helper';
import { AccountBaseModule } from '../base/account-base.module';
import { JWTAuthModule } from 'src/base/auth/jwt-auth.module';
import { OrmModule } from 'src/base/orm/orm.module';


@Module({
  imports: [
    OrmModule,
    AccountBaseModule,
    JWTAuthModule
  ],
  controllers: [Web3SignController],
  providers: [
    PolkadotSignHelper,
    MetamaskSignHelper,
    Web3SignService,
  ],
  exports: [
    Web3SignService
  ]
})
export class Web3SignModule { }
