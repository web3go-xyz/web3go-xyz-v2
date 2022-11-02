import { Module } from '@nestjs/common';
import { DebugService } from './debug.service';
import { DebugController } from './debug.controller';
import { databaseProviders_metabase, databaseProviders_platform } from 'src/base/orm/database.provider.v2';
import repositoryProviders_platform from 'src/base/orm/repository.provider.v2/platform';
import repositoryProviders_metabase from 'src/base/orm/repository.provider.v2/metabase';
@Module({
  providers: [
    ...databaseProviders_platform,
    ...repositoryProviders_platform,
    ...databaseProviders_metabase,
    ...repositoryProviders_metabase,
    DebugService],
  controllers: [DebugController]
})
export class DebugModule { }
