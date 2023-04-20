import { Module } from '@nestjs/common';
import { AccountInfoModule } from 'src/account/info/account-info.module';
import { JWTAuthModule } from 'src/base/auth/jwt-auth.module';
import { PlatformOrmModule } from 'src/base/orm/platoform.orm.module';
import { EventModule } from 'src/event-bus/event.module';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';


@Module({
    imports: [
        PlatformOrmModule,
        EventModule,
        JWTAuthModule,
        AccountInfoModule
    ],
    controllers: [FollowController],
    providers: [
        FollowService
    ],
    exports: [FollowService]
})
export class FollowModule { }
