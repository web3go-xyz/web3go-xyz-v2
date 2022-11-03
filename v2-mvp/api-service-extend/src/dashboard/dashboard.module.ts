import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { JWTAuthModule } from 'src/base/auth/jwt-auth.module';
import { OrmModule } from 'src/base/orm/orm.module';
@Module({
    imports: [
        OrmModule,
        JWTAuthModule
    ],
    controllers: [DashboardController],
    providers: [ 
        DashboardService
    ],
    exports: []
})
export class DashboardModule { }


