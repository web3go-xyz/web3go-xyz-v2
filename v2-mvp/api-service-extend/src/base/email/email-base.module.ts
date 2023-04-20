import { Module } from '@nestjs/common';
import { EmailBaseService } from './email-base.service';



@Module({
  imports: [

  ],
  controllers: [],
  providers: [
    EmailBaseService
  ],
  exports: [
    EmailBaseService
  ]
})
export class EmailBaseModule { }
