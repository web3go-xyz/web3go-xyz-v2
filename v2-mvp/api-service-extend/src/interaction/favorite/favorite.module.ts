import { Module } from '@nestjs/common'; 
import { PlatformOrmModule } from 'src/base/orm/platoform.orm.module';
import { EventModule } from 'src/event-bus/event.module';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';

@Module({
    imports: [
        PlatformOrmModule,
        EventModule
    ],
    controllers: [FavoriteController],
    providers: [

        FavoriteService
    ],
    exports: [FavoriteService]
})
export class FavoriteModule { }
