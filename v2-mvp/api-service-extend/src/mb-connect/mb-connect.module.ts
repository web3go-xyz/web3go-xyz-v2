import { Module } from '@nestjs/common';
import { MBOrmModule } from 'src/base/orm/mb.orm.module';

import { MBConnectService } from './mb-connect.service';
@Module({
  imports: [
    MBOrmModule],
  providers: [

    MBConnectService],
  controllers: [],
  exports: [MBConnectService]
})
export class MBConnectModule { }
