import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

export class RedisIoAdapter extends IoAdapter {
  /**
   * constructor
   *
   * @param config ConfigService
   */
  public constructor(private readonly config: ConfigService) {
    super();
  }

  private adapterConstructor: ReturnType<typeof createAdapter>;

  public async connectToRedis(): Promise<void> {
    const pubClient = createClient({
      url: this.config.get<string>('REDIS_CONNECT_URL'),
    });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  public createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
