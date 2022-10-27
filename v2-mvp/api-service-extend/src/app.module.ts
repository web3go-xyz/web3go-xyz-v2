import { Module } from '@nestjs/common';
import { StatusMonitorModule } from 'nestjs-status-monitor';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountAuthModule } from './account/auth/account-auth.module';
import { AccountInfoModule } from './account/info/account-info.module';
import { Web3SignModule } from './account/web3/web3.sign.module';
import { DebugModule } from './debug/debug.module';
import { KVModule } from './base/kv/kv.module';
import { AccountBaseModule } from './account/base/account-base.module';
import { JWTAuthModule } from './base/auth/jwt-auth.module';
@Module({
  imports: [
    StatusMonitorModule.forRoot(),
    JWTAuthModule,
    KVModule,
    AccountInfoModule,
    AccountAuthModule,
    Web3SignModule,
    DebugModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
