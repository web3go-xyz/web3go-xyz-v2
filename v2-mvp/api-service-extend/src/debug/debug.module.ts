import { Module } from '@nestjs/common';
import { DebugService } from './debug.service';
import { DebugController } from './debug.controller';
import { JobModule } from 'src/jobs/job.module'; 
import { PlatformOrmModule } from 'src/base/orm/platoform.orm.module';
@Module({
  imports: [
    PlatformOrmModule,
    JobModule],
  providers: [

    DebugService],
  controllers: [DebugController]
})
export class DebugModule { }
