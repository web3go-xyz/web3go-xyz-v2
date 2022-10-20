import { Global, Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis';
import { KVService } from './kv.service';

import { AppConfig } from '../setting/appConfig';
import { LoggerModule } from '../log/loggerModule';

@Global()
@Module({
    imports: [RedisModule.register(AppConfig.redisOption), LoggerModule],
    controllers: [],
    providers: [KVService],
    exports: [KVService, LoggerModule],
})
export class KVModule { }
