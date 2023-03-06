// redis-config.service.ts
import { Injectable } from '@nestjs/common';
import {
  RedisModuleOptions,
  RedisOptionsFactory,
} from '@liaoliaots/nestjs-redis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisConfigService implements RedisOptionsFactory {
  public constructor(private readonly config: ConfigService) {
  }
  public createRedisOptions(): RedisModuleOptions {
    return {
      readyLog: true,
      config: {
        host: this.config.get<string>('REDIS_CONNECT_HOST', 'localhost'),
        port: this.config.get<number>('REDIS_CONNECT_PORT', 6379),
        password: this.config.get<string>('REDIS_CONNECT_PASSWORD', null),
      },
    };
  }
}