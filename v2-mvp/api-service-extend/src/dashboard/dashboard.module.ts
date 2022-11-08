import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { JWTAuthModule } from 'src/base/auth/jwt-auth.module';
import { OrmModule } from 'src/base/orm/orm.module';
import { DashboardOperationService } from './dashboard-operation.service';
import { ShareModule } from 'src/share/share.module';
import { ShareService } from 'src/share/share.service';
@Module({
    imports: [
        OrmModule,
        JWTAuthModule,
        ShareModule
    ],
    controllers: [DashboardController],
    providers: [
        DashboardService,
        DashboardOperationService,
        ShareService
    ],
    exports: []
})
export class DashboardModule { }


