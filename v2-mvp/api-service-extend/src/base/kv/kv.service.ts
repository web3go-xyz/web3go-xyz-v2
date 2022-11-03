import { Injectable } from '@nestjs/common';
import { W3Logger } from './../log/logger.service';

import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
const Redlock = require('redlock');

@Injectable()
export class KVService {
    private client: Redis;
    redlock: any;
    constructor(
        private redisService: RedisService,
        private readonly logger: W3Logger,
    ) {
        var client = this.getClient();
        this.client = client;
        this.redlock = new Redlock([this.client], {
            retryDelay: 200, // time in ms
            retryCount: 10,
        });
    }
    getClient(): Redis {
        return this.redisService.getClient();
    }

    //SET
    async set(key: string, value: any, seconds?: number) {
        if (!this.client) {
            await this.getClient();
        }
        if (!seconds) {
            await this.client.set(key, value);
        } else {
            await this.client.set(key, value, 'EX', seconds);
        }
    }
    async setObj(key: string, value: object, seconds?: number) {
        let str = JSON.stringify(value);
        return this.set(key, str, seconds);
    }
    async getObj<T>(key: string) {
        var data = await this.get(key);
        if (!data) return;
        return JSON.parse(data) as T;
    }
    //GET
    async get(key: string) {
        if (!this.client) {
            await this.getClient();
        }
        var data = await this.client.get(key);
        if (!data) return;
        return data;
    }

    //DEL
    async del(key: string) {
        if (!this.client) {
            await this.getClient();
        }
        await this.client.del(key);
    }

    //zadd
    async zadd(key: string, score: number, value: string) {
        if (!this.client) {
            await this.getClient();
        }
        await this.client.zadd(key, score, value);
    }

    //zrange
    async zrange(key: string, start: number, stop: number) {
        if (!this.client) {
            await this.getClient();
        }
        var data = await this.client.zrange(key, start, stop);
        if (!data) return;
        return data;
    }

    //zrem
    async zrem(key: string, member: string) {
        if (!this.client) {
            await this.getClient();
        }
        await this.client.zrem(key, member);
    }

    async lock(key: string, ttl: number): Promise<any> {
        try {
            let et = await this.client.exists(key);
            if (!et) {
                this.logger.log('not exists key=' + key + '\t' + et);
                return null;
            }
            let lockKey = 'lock4' + key;
            const lock = await this.redlock.lock(lockKey, ttl);
            this.logger.log(
                'redis lock for key=' +
                key +
                ',ttl=' +
                ttl +
                ',lockValue=' +
                lock.value +
                'lockKey=' +
                lockKey,
            );
            return lock;
        } catch (err) {
            this.logger.error(err);
        } finally {
        }
    }

    async unlock(lock: any) {
        try {
            lock.unlock();
            this.logger.log('redis unlock with lockValue=' + lock.value);
        } catch (err) {
            this.logger.error(err);
        }
    }
}
