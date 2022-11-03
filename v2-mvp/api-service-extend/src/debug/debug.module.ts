import { Module } from '@nestjs/common';
import { DebugService } from './debug.service';
import { DebugController } from './debug.controller';
import { JobModule } from 'src/jobs/job.module';
import { OrmModule } from 'src/base/orm/orm.module';
@Module({
  imports: [
    OrmModule,
    JobModule],
  providers: [

    DebugService],
  controllers: [DebugController]
})
export class DebugModule { }
