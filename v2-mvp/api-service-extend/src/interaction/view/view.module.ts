import { Module } from '@nestjs/common';
import { JWTAuthModule } from 'src/base/auth/jwt-auth.module';
import { OrmModule } from 'src/base/orm/orm.module';
import { EventModule } from 'src/event-bus/event.module';
import { ViewController } from './view.controller';
import { ViewService } from './view.service';


@Module({
    imports: [
        OrmModule,
        EventModule,
        JWTAuthModule
    ],
    controllers: [ViewController],
    providers: [

        ViewService
    ],
    exports: [ViewService]
})
export class ViewModule { }
