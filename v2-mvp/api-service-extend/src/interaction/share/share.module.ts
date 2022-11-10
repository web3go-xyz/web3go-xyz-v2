import { Module } from '@nestjs/common';
import { PlatformOrmModule } from 'src/base/orm/platoform.orm.module';
import { EventModule } from 'src/event-bus/event.module';
import { MBConnectModule } from 'src/mb-connect/mb-connect.module';
import { ShareController } from './share.controller';
import { ShareService } from './share.service';

@Module({
    imports: [
        PlatformOrmModule,
        EventModule,
        MBConnectModule
    ],
    controllers: [ShareController],
    providers: [

        ShareService
    ],
    exports: [ShareService]
})
export class ShareModule { }
