import { Module } from '@nestjs/common';
import { DebugService } from './debug.service';
import { DebugController } from './debug.controller';
import { databaseProviders_platform } from 'src/base/orm/database.provider.v2';
import repositoryProviders_platform from 'src/base/orm/repository.provider.v2';
@Module({
  providers: [...databaseProviders_platform,
  ...repositoryProviders_platform,
    DebugService],
  controllers: [DebugController]
})
export class DebugModule { }
