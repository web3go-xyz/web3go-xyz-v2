import { Module } from '@nestjs/common';
import { OrmModule } from 'src/base/orm/orm.module';
import { EventModule } from 'src/event-bus/event.module';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';

@Module({
    imports: [
        OrmModule,
        EventModule
    ],
    controllers: [FavoriteController],
    providers: [

        FavoriteService
    ],
    exports: [FavoriteService]
})
export class FavoriteModule { }
