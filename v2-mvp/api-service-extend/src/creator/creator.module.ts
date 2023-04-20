import { Module } from '@nestjs/common';
import { CreatorService } from './creator.service';
import { CreatorController } from './creator.controller'; 
import { PlatformOrmModule } from 'src/base/orm/platoform.orm.module';

@Module({
  imports: [
    PlatformOrmModule
  ],
  providers: [CreatorService],
  controllers: [CreatorController],
  exports: [CreatorService]
})
export class CreatorModule { }

