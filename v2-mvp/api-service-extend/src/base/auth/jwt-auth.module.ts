import { Module } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import JWTConfig from './JWTConfig';
import { JWTAuthService } from './jwt-auth.service';


@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: JWTConfig.secret,
      signOptions: { expiresIn: JWTConfig.expiresIn },
    })
  ],
  controllers: [],
  providers: [
    JwtStrategy,
    JWTAuthService
  ],
  exports: [
    JwtStrategy,
    JWTAuthService
  ]
})
export class JWTAuthModule { }
