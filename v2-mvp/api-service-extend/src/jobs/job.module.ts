import { Module } from '@nestjs/common';
import { Job_SyncDashboardFromMB } from './job.syncDashboardFromMB';
import { Job_SyncDatasetFromMB } from './job.syncDatasetFromMB';
import { MBConnectModule } from 'src/mb-connect/mb-connect.module';
import { PlatformOrmModule } from 'src/base/orm/platoform.orm.module';
@Module({
  imports: [PlatformOrmModule, MBConnectModule],
  providers: [
    Job_SyncDashboardFromMB, Job_SyncDatasetFromMB],
  exports: [Job_SyncDashboardFromMB, Job_SyncDatasetFromMB]

})
export class JobModule { }
