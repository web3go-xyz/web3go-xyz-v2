import { Global, Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { KVService } from './kv.service';

import { LoggerModule } from '../log/loggerModule';
import { AppConfig } from '../setting/appConfig';

@Global()
@Module({
    imports: [RedisModule.forRoot({
        config: {
            ...AppConfig.redisOption
        }
    }), LoggerModule],
    controllers: [],
    providers: [KVService],
    exports: [KVService, LoggerModule],
})
export class KVModule { }
