import { Module } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import JWTConfig from 'src/base/auth/config';
import { JwtStrategy } from 'src/base/auth/jwt.strategy';
import { databaseProviders_platform } from 'src/base/orm/database.provider.v2';
import repositoryProviders_platform from 'src/base/orm/repository.provider.v2';

import { KVService } from 'src/base/kv/kv.service';
import { KVModule } from 'src/base/kv/kv.module';
import { Web3SignInController } from './web3.signin.controller';
import { Web3SignInService } from './web3.signin.service';
import { AccountBaseService } from '../base/account-base.service';
import { PolkadotSignHelper } from 'src/base/web3/sign/polkadot/polkadot.sign.helper';
import { MetamaskSignHelper } from 'src/base/web3/sign/metamask/metamask.sign.helper';


@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: JWTConfig.secret,
      signOptions: { expiresIn: JWTConfig.expiresInSeconds },
    }),
    KVModule
  ],
  controllers: [Web3SignInController],
  providers: [
    ...databaseProviders_platform,
    ...repositoryProviders_platform,
    Web3SignInService,
    JwtStrategy,
    KVService,
    AccountBaseService,
    PolkadotSignHelper,
    MetamaskSignHelper
  ],
})
export class Web3SignInModule { }
