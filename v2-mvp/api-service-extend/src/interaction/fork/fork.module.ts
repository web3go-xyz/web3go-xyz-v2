import { Module } from '@nestjs/common';
import { JWTAuthModule } from 'src/base/auth/jwt-auth.module';
import { PlatformOrmModule } from 'src/base/orm/platoform.orm.module';
import { EventModule } from 'src/event-bus/event.module';
import { ForkController } from './fork.controller';
import { ForkService } from './fork.service';


@Module({
    imports: [
        PlatformOrmModule,
        EventModule,
        JWTAuthModule
    ],
    controllers: [ForkController],
    providers: [

        ForkService
    ],
    exports: [ForkService]
})
export class ForkModule { }
