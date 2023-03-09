import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller'; 
import { PlatformOrmModule } from 'src/base/orm/platoform.orm.module';

@Module({
  imports: [
    PlatformOrmModule
  ],
  providers: [TagService],
  controllers: [TagController],
  exports: [TagService]
})
export class TagModule { }
