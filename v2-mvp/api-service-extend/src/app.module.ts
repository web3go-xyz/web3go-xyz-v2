import { Module } from '@nestjs/common';
import { StatusMonitorModule } from 'nestjs-status-monitor';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountAuthModule } from './account/auth/account-auth.module';
import { AccountInfoModule } from './account/info/account-info.module';
@Module({
  imports: [
    StatusMonitorModule.forRoot(),
    AccountInfoModule,
    AccountAuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
