import { Module } from '@nestjs/common';
import { StatusMonitorModule } from 'nestjs-status-monitor';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountAuthModule } from './account/auth/account-auth.module';
import { AccountInfoModule } from './account/info/account-info.module';
import { Web3SignModule } from './account/web3/web3.sign.module';
import { DebugModule } from './debug/debug.module';
import { KVModule } from './base/kv/kv.module';
import { JWTAuthModule } from './base/auth/jwt-auth.module';
import { HomepageModule } from './homepage/homepage.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [
    StatusMonitorModule.forRoot(),
    ScheduleModule.forRoot(),
    JWTAuthModule,
    KVModule,
    AccountInfoModule,
    AccountAuthModule,
    Web3SignModule,
    DebugModule,
    HomepageModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
