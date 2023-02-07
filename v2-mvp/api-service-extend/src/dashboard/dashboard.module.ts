import { Module } from '@nestjs/common'; 
import { JWTAuthModule } from 'src/base/auth/jwt-auth.module';
import { MBOrmModule } from 'src/base/orm/mb.orm.module';
import { PlatformOrmModule } from 'src/base/orm/platoform.orm.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { DashboardShareController } from './share/dashboardShare.controller';

@Module({
    imports: [
        PlatformOrmModule,
        MBOrmModule,
        JWTAuthModule
    ],
    controllers: [DashboardController, DashboardShareController],
    providers: [
        DashboardService,
    ],
    exports: []
})
export class DashboardModule { }


