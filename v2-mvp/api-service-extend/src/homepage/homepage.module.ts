import { Module } from '@nestjs/common';
import { HomepageService } from './homepage.service';
import { HomepageController } from './homepage.controller';

@Module({
  providers: [HomepageService],
  controllers: [HomepageController]
})
export class HomepageModule {}
