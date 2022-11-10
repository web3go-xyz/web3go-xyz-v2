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
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventModule } from './event-bus/event.module';
import { CreatorModule } from './creator/creator.module';
import { TagModule } from './interaction/tag/tag.module';
import { PlatformOrmModule } from './base/orm/platoform.orm.module';
import { ShareModule } from './interaction/share/share.module';
import { ViewModule } from './interaction/view/view.module';
import { ForkModule } from './interaction/fork/fork.module';
import { FavoriteModule } from './interaction/favorite/favorite.module';
import { FollowModule } from './interaction/follow/follow.module';
import { MBConnectModule } from './mb-connect/mb-connect.module';
import { MBOrmModule } from './base/orm/mb.orm.module';

@Module({
  imports: [
    StatusMonitorModule.forRoot(),
    EventEmitterModule.forRoot(
      {
        wildcard: true,// set this to `true` to use wildcards
        delimiter: '.',      // the delimiter used to segment namespaces
      }
    ),
    ScheduleModule.forRoot(),
    PlatformOrmModule,
    MBOrmModule,
    JWTAuthModule,
    KVModule,
    EventModule,
    MBConnectModule,
    AccountInfoModule,
    AccountAuthModule,
    Web3SignModule,
    DebugModule,
    HomepageModule,
    DashboardModule,
    CreatorModule,
    TagModule,
    ShareModule,
    ViewModule,
    ForkModule,
    FavoriteModule,
    FollowModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
