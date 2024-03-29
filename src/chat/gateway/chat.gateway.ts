import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import {
  ImageMessage,
  NewsItemMessage,
  TextMessage,
  VideoMessage,
  VoiceMessage,
} from './message';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'chat',
})
export class ChatGateway {
  private readonly redis: Redis;

  @WebSocketServer()
  public server: Server;

  /**
   * constructor
   *
   * @param config ConfigService
   */
  public constructor(
    private readonly config: ConfigService,
    private readonly redisService: RedisService,
  ) {
    this.redis = this.redisService.getClient();

    // (async () => {
    //   const client = createClient({
    //     url: config.get<string>('REDIS_CONNECT_URL'),
    //   });
    //
    //   // redis connect error
    //   client.on('error', (err) => console.log('Redis Client Error', err));
    //   await client.connect();
    //
    //   // Subscribing to a channel requires a dedicated stand-alone connection
    //   if (!this.redis) {
    //     this.redis = client.duplicate();
    //     await this.redis.connect();
    //   }
    //
    //   // Gracefully close a client's connection to Redis, by sending the QUIT command to the server
    //   // await client.quit();
    // })();
  }

  /**
   * WebSocket onConnection
   *
   * @param socket Socket
   */
  @SubscribeMessage('connect')
  public handleConnection(socket: Socket) {
    // default use customer service id for room
    socket.join(String(socket.handshake.auth.id));
    console.log('handshake success and join room:', socket.handshake.auth.id);
  }

  @SubscribeMessage('wechat.message')
  public handleTextMessageEvent(
    socket: Socket,
    data:
      | TextMessage
      | ImageMessage
      | VoiceMessage
      | NewsItemMessage
      | VideoMessage,
  ): void {
    // todo auth
    const content: string = JSON.stringify(data);
    this.redis.publish(
      this.config.get<string>('REDIS_PUBLISH_WECHAT_CHAT_CHANNEL'),
      content,
    );
    // console.log('hello');
  }
}
