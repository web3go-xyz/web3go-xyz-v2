import { Module } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import JWTConfig from 'src/base/auth/config';
import { LocalStrategy } from 'src/base/auth/local.strategy';
import { JwtStrategy } from 'src/base/auth/jwt.strategy';
import { databaseProviders_platform } from 'src/base/orm/database.provider.v2';
import repositoryProviders_platform from 'src/base/orm/repository.provider.v2';
import { AccountInfoService } from './account-info.service';
import { AccountInfoController } from './account-info.controller';


@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: JWTConfig.secret,
      signOptions: { expiresIn: JWTConfig.expiresIn },
    })
  ],
  controllers: [AccountInfoController],
  providers: [
    ...databaseProviders_platform,
    ...repositoryProviders_platform,
    AccountInfoService,
  ],
})
export class AccountInfoModule { }
