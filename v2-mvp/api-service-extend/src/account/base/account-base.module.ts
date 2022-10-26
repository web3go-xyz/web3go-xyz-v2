import { Module } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import JWTConfig from 'src/base/auth/config';
import { databaseProviders_platform } from 'src/base/orm/database.provider.v2';
import repositoryProviders_platform from 'src/base/orm/repository.provider.v2';
import { AccountBaseService } from './account-base.service';
import { KVModule } from 'src/base/kv/kv.module';
import { KVService } from 'src/base/kv/kv.service';
import { JwtStrategy } from 'src/base/auth/jwt.strategy';
import { VerifyCodeBaseService } from './verifycode-base.service'; 
import { EmailBaseService } from 'src/base/email/email-base.service';


@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: JWTConfig.secret,
      signOptions: { expiresIn: JWTConfig.expiresIn },
    }),
    KVModule
  ],
  controllers: [],
  providers: [
    KVService,
    JwtStrategy,
    ...databaseProviders_platform,
    ...repositoryProviders_platform,
    AccountBaseService,
    VerifyCodeBaseService,
    EmailBaseService
  ],
  exports: [
    KVService,
    JwtStrategy,
    AccountBaseService,
    VerifyCodeBaseService,
    EmailBaseService,
    ...databaseProviders_platform,
    ...repositoryProviders_platform,
  ]
})
export class AccountBaseModule { }
