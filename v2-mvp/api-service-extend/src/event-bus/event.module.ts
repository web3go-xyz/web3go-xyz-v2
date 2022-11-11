import { Module } from '@nestjs/common';
import { PlatformOrmModule } from 'src/base/orm/platoform.orm.module';
import { JobModule } from 'src/jobs/job.module';
import { EventController } from './event.controller';
import { EventService } from './event.service';

@Module({
    imports: [
        PlatformOrmModule, JobModule
    ],
    controllers: [EventController],
    providers: [
        EventService
    ],
    exports: [EventService]
})
export class EventModule { }
