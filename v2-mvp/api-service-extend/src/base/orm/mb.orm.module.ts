import { Module } from '@nestjs/common';

import { databaseProviders_metabase } from 'src/base/orm/database.provider.v2';
import repositoryProviders_metabase from './repository.provider.v2/metabase';


@Module({
  imports: [
  ],

  providers: [

    ...databaseProviders_metabase,
    ...repositoryProviders_metabase,
  ],
  exports: [

    ...databaseProviders_metabase,
    ...repositoryProviders_metabase,
  ]
})
export class MBOrmModule { }
