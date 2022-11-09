import { Module } from '@nestjs/common';
import { CreatorService } from './creator.service';
import { CreatorController } from './creator.controller';
import { OrmModule } from 'src/base/orm/orm.module';

@Module({
  imports: [
    OrmModule
  ],
  providers: [CreatorService],
  controllers: [CreatorController],
  exports: [CreatorService]
})
export class CreatorModule { }

