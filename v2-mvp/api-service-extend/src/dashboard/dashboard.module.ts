import { Module } from '@nestjs/common'; 
import { PlatformOrmModule } from 'src/base/orm/platoform.orm.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { DashboardShareController } from './share/dashboardShare.controller';

@Module({
    imports: [
        PlatformOrmModule
    ],
    controllers: [DashboardController, DashboardShareController],
    providers: [
        DashboardService,
    ],
    exports: []
})
export class DashboardModule { }


