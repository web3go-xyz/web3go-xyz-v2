import { Module } from '@nestjs/common'; 
import { PlatformOrmModule } from 'src/base/orm/platoform.orm.module';
import { EventService } from './event.service';

@Module({
    imports: [
        PlatformOrmModule,
    ],
    controllers: [],
    providers: [
        EventService
    ],
    exports: [EventService]
})
export class EventModule { }
