import { Module } from '@nestjs/common';
import { Job_SyncDashboardFromMB } from './job.syncDashboardFromMB';
import { OrmModule } from 'src/base/orm/orm.module';
@Module({
  imports: [OrmModule],
  providers: [

    Job_SyncDashboardFromMB],
  exports: [Job_SyncDashboardFromMB]

})
export class JobModule { }
