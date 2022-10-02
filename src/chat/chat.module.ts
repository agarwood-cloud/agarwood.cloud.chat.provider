import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ChatGateway } from './gateway/chat.gateway';
import { SubscriberGateway } from './gateway/subscriber.gateway';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MATH_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
    ]),
  ],
  controllers: [],
  providers: [ChatGateway, SubscriberGateway],
})
export class ChatModule {}
