import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { OrmModule } from 'src/base/orm/orm.module';

@Module({
  imports: [
    OrmModule
  ],
  providers: [TagService],
  controllers: [TagController],
  exports: [TagService]
})
export class TagModule { }
