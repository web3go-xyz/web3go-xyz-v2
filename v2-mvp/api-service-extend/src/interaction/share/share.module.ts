import { Module } from '@nestjs/common';
import { OrmModule } from 'src/base/orm/orm.module';
import { EventModule } from 'src/event-bus/event.module';
import { ShareController } from './share.controller';
import { ShareService } from './share.service';

@Module({
    imports: [
        OrmModule,
        EventModule,
    ],
    controllers: [ShareController],
    providers: [

        ShareService
    ],
    exports: [ShareService]
})
export class ShareModule { }
