import { Module } from '@nestjs/common';
import { JWTAuthModule } from 'src/base/auth/jwt-auth.module'; 
import { PlatformOrmModule } from 'src/base/orm/platoform.orm.module';
import { EventModule } from 'src/event-bus/event.module';
import { ViewController } from './view.controller';
import { ViewService } from './view.service';


@Module({
    imports: [
        PlatformOrmModule,
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
