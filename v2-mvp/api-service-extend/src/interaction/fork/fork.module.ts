import { Module } from '@nestjs/common';
import { OrmModule } from 'src/base/orm/orm.module';
import { EventModule } from 'src/event-bus/event.module';
import { ForkController } from './fork.controller';
import { ForkService } from './fork.service';


@Module({
    imports: [
        OrmModule,
        EventModule
    ],
    controllers: [ForkController],
    providers: [

        ForkService
    ],
    exports: [ForkService]
})
export class ForkModule { }
