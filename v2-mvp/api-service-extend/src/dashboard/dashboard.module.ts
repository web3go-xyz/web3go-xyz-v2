import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { databaseProviders_platform } from 'src/base/orm/database.provider.v2';
import repositoryProviders_platform from 'src/base/orm/repository.provider.v2/platform';
import { databaseProviders_metabase } from 'src/base/orm/database.provider.v2';
import repositoryProviders_metabase from 'src/base/orm/repository.provider.v2/metabase';
import { JWTAuthModule } from 'src/base/auth/jwt-auth.module';
@Module({
    imports: [
        JWTAuthModule
    ],
    controllers: [DashboardController],
    providers: [
        ...databaseProviders_platform,
        ...repositoryProviders_platform,
        ...databaseProviders_metabase,
        ...repositoryProviders_metabase,
        DashboardService
    ],
    exports: []
})
export class DashboardModule { }


