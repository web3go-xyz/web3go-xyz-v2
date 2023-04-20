import { Module } from '@nestjs/common';

import { databaseProviders_platform } from 'src/base/orm/database.provider.v2';
import repositoryProviders_platform from 'src/base/orm/repository.provider.v2/platform';


@Module({
  imports: [
  ],

  providers: [
    ...databaseProviders_platform,
    ...repositoryProviders_platform,

  ],
  exports: [
    ...databaseProviders_platform,
    ...repositoryProviders_platform,
  ]
})
export class PlatformOrmModule { }
