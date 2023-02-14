import { Module } from '@nestjs/common'; 
import { JWTAuthModule } from 'src/base/auth/jwt-auth.module';
import { MBOrmModule } from 'src/base/orm/mb.orm.module';
import { PlatformOrmModule } from 'src/base/orm/platoform.orm.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
    imports: [
        PlatformOrmModule,
        MBOrmModule,
        JWTAuthModule
    ],
    controllers: [DashboardController],
    providers: [
        DashboardService,
    ],
    exports: [DashboardService]
})
export class DashboardModule { }


