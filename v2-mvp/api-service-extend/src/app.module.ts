import { Module } from '@nestjs/common';
import { StatusMonitorModule } from 'nestjs-status-monitor';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountAuthModule } from './account/auth/account-auth.module';
import { AccountInfoModule } from './account/info/account-info.module'; 
import { Web3SignInModule } from './account/web3/web3.signin.module';
import { DebugModule } from './debug/debug.module';
@Module({
  imports: [
    StatusMonitorModule.forRoot(),
    AccountInfoModule,
    AccountAuthModule,
    Web3SignInModule,
    DebugModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
