import { Module } from '@nestjs/common';
import { OrmModule } from 'src/base/orm/orm.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
    imports: [
        OrmModule
    ],
    controllers: [DashboardController],
    providers: [
        DashboardService,
    ],
    exports: []
})
export class DashboardModule { }


