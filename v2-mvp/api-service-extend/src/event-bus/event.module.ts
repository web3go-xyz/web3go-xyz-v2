import { Module } from '@nestjs/common';
import { OrmModule } from 'src/base/orm/orm.module';
import { EventService } from './event.service';

@Module({
    imports: [
        OrmModule,
    ],
    controllers: [],
    providers: [
        EventService
    ],
    exports: [EventService]
})
export class EventModule { }
