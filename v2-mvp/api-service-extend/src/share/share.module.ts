import { Module } from '@nestjs/common';
import { OrmModule } from 'src/base/orm/orm.module';
import { ShareService } from './share.service';

@Module({
    imports: [
        OrmModule,
    ],
    controllers: [],
    providers: [

        ShareService
    ],
    exports: [ShareService]
})
export class ShareModule { }
