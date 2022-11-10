import { Module } from '@nestjs/common';
import { JWTAuthModule } from 'src/base/auth/jwt-auth.module';
import { OrmModule } from 'src/base/orm/orm.module';
import { EventModule } from 'src/event-bus/event.module';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';


@Module({
    imports: [
        OrmModule,
        EventModule,
        JWTAuthModule
    ],
    controllers: [FollowController],
    providers: [
        FollowService
    ],
    exports: [FollowService]
})
export class FollowModule { }
