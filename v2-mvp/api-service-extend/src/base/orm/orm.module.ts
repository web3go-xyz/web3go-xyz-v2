import { Module } from '@nestjs/common';

import { databaseProviders_metabase, databaseProviders_platform } from 'src/base/orm/database.provider.v2';
import repositoryProviders_platform from 'src/base/orm/repository.provider.v2/platform';
import repositoryProviders_metabase from './repository.provider.v2/metabase';


@Module({
  imports: [ 
  ],

  providers: [
    ...databaseProviders_platform,
    ...repositoryProviders_platform,
    ...databaseProviders_metabase,
    ...repositoryProviders_metabase,
  ],
  exports: [
    ...databaseProviders_platform,
    ...repositoryProviders_platform,
    ...databaseProviders_metabase,
    ...repositoryProviders_metabase,
  ]
})
export class OrmModule { }
