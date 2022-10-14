import { Module } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/base/auth/constants';
import { LocalStrategy } from 'src/base/auth/local.strategy';
import { JwtStrategy } from 'src/base/auth/jwt.strategy';
import { databaseProviders_platform } from 'src/base/orm/database.provider.v2';
import repositoryProviders_platform from 'src/base/orm/repository.provider.v2';
import { AccountAuthService } from './account-auth.service';
import { AccountAuthController } from './account-auth.controller';

const authServiceProvider = {
  provide: 'LOCAL_AUTH_SERVICE',
  useExisting: AccountAuthService,
};
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    })
  ],
  controllers: [AccountAuthController],
  providers: [
    ...databaseProviders_platform,
    ...repositoryProviders_platform,
    AccountAuthService,
    authServiceProvider,
    LocalStrategy,
    JwtStrategy
  ],
})
export class AccountAuthModule { }
