import { Module } from '@nestjs/common';
import { StatusMonitorModule } from 'nestjs-status-monitor';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserAuthModule } from './user/user-auth/user-auth.module';
@Module({
  imports: [
    StatusMonitorModule.forRoot(),
    UserAuthModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
