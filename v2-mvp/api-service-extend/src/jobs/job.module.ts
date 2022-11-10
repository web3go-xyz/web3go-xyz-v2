import { Module } from '@nestjs/common';
import { Job_SyncDashboardFromMB } from './job.syncDashboardFromMB';
import { MBConnectModule } from 'src/mb-connect/mb-connect.module';
import { PlatformOrmModule } from 'src/base/orm/platoform.orm.module';
@Module({
  imports: [PlatformOrmModule, MBConnectModule],
  providers: [
    Job_SyncDashboardFromMB],
  exports: [Job_SyncDashboardFromMB]

})
export class JobModule { }
