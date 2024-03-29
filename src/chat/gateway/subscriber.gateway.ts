import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'chat',
})
export class SubscriberGateway {
  @WebSocketServer()
  public server: Server;

  private readonly redis: Redis;

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

    this.subscriberFromTencent();

    this.subscriberFromCustomer();
  }

  /**
   * Subscriber message from tencent, and send to customer service
   */
  public subscriberFromTencent(): void {
    (async () => {
      const client = createClient({
        url: this.config.get<string>('REDIS_CONNECT_URL'),
      });

      // redis connect error
      client.on('error', (err) => console.log('Redis Client Error', err));
      await client.connect();

      // Subscribing to a channel requires a dedicated stand-alone connection
      const subscriber = client.duplicate();
      await subscriber.connect();
      // subscriber channel
      await subscriber.subscribe(
        this.config.get<string>('REDIS_SUBSCRIBER_WECHAT_CHAT_CHANNEL'),
        (message: string) => {
          const parseMessage = JSON.parse(message);
          // console.log('parseMessage', parseMessage);
          // send to customer service
          // console.log('tencent send to customer service:', parseMessage);
          try {
            this.server
              .to(String(parseMessage.toUserName))
              .emit(parseMessage.msgType, parseMessage);
          } catch (error) {
            console.log('REDIS_SUBSCRIBER_WECHAT_CHAT_CHANNEL: ERROR:', error);
          }
        },
      );

      // Gracefully close a client's connection to Redis, by sending the QUIT command to the server
      // await client.quit();
    })();
  }

  /**
   * Subscriber message from customer, and send to customer service
   */
  public subscriberFromCustomer(): void {
    (async () => {
      const client = createClient({
        url: this.config.get<string>('REDIS_CONNECT_URL'),
      });

      // redis connect error
      client.on('error', (err) => console.log('Redis Client Error', err));
      await client.connect();

      // Subscribing to a channel requires a dedicated stand-alone connection
      const subscriber = client.duplicate();
      await subscriber.connect();
      // subscriber channel
      await subscriber.subscribe(
        this.config.get<string>(
          'REDIS_SUBSCRIBER_WECHAT_CUSTOMER_CHAT_CHANNEL',
        ),
        (message: string) => {
          const parseMessage = JSON.parse(message);
          // console.log('parseMessage:customer', parseMessage);
          // send to customer service
          try {
            // console.log('send to customer service', parseMessage);
            this.server
              .to(String(parseMessage.fromUserName))
              .emit(parseMessage.msgType, parseMessage);
          } catch (error) {
            console.log(
              'REDIS_SUBSCRIBER_WECHAT_CUSTOMER_CHAT_CHANNEL: ERROR:',
              error,
            );
          }
        },
      );

      // Gracefully close a client's connection to Redis, by sending the QUIT command to the server
      // await client.quit();
    })();
  }
}
