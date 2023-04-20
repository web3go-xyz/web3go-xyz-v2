import { Module } from '@nestjs/common';
import { JWTAuthModule } from 'src/base/auth/jwt-auth.module';
import { MBOrmModule } from 'src/base/orm/mb.orm.module';
import { PlatformOrmModule } from 'src/base/orm/platoform.orm.module';
import { DashboardService } from 'src/dashboard/dashboard.service';
import { EventModule } from 'src/event-bus/event.module';
import { MBConnectModule } from 'src/mb-connect/mb-connect.module';
import { DashboardShareController } from './dashboardShare.controller';
import { ShareController } from './share.controller';
import { ShareService } from './share.service';

@Module({
    imports: [
        PlatformOrmModule,
        MBOrmModule,
        EventModule,
        JWTAuthModule,
        MBConnectModule
    ],
    controllers: [ShareController, DashboardShareController],
    providers: [
        ShareService,
        DashboardService
    ],
    exports: [ShareService]
})
export class ShareModule { }
