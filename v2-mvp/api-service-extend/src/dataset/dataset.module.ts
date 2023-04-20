import { Module } from '@nestjs/common'; 
import { JWTAuthModule } from 'src/base/auth/jwt-auth.module';
import { MBOrmModule } from 'src/base/orm/mb.orm.module';
import { PlatformOrmModule } from 'src/base/orm/platoform.orm.module';
import { DatasetController } from './dataset.controller';
import { DatasetService } from './dataset.service';


@Module({
    imports: [
        PlatformOrmModule,
        MBOrmModule,
        JWTAuthModule,
        // ShareModule,
        // ViewModule,
        // ForkModule,
        // FavoriteModule,
        // FollowModule
    ],
    controllers: [DatasetController],
    providers: [
        DatasetService,
    ],
    exports: [DatasetService]
})
export class DatasetModule { }


