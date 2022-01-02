import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'chat',
})
export class SubscriberGateway {
  @WebSocketServer()
  public server: Server;

  /**
   * constructor
   *
   * @param config ConfigService
   */
  public constructor(private readonly config: ConfigService) {
    (async () => {
      const client = createClient({
        url: config.get<string>('REDIS_CONNECT_URL'),
      });

      // redis connect error
      client.on('error', (err) => console.log('Redis Client Error', err));
      await client.connect();

      // Subscribing to a channel requires a dedicated stand-alone connection
      const subscriber = client.duplicate();
      await subscriber.connect();
      // subscriber channel
      await subscriber.subscribe(
        config.get<string>('REDIS_SUBSCRIBER_WECHAT_CHAT_CHANNEL'),
        (message: string) => {
          const parseMessage = JSON.parse(message);
          console.log('parseMessage', parseMessage);
          // send to customer service
          this.server
            .to(parseMessage.toUserName)
            .emit(parseMessage.msgType, parseMessage);
        },
      );

      // Gracefully close a client's connection to Redis, by sending the QUIT command to the server
      // await client.quit();
    })();
  }
}
