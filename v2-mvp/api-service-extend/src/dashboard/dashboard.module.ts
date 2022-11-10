import { Module } from '@nestjs/common'; 
import { PlatformOrmModule } from 'src/base/orm/platoform.orm.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
    imports: [
        PlatformOrmModule
    ],
    controllers: [DashboardController],
    providers: [
        DashboardService,
    ],
    exports: []
})
export class DashboardModule { }


