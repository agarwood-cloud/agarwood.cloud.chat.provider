import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat.gateway';
import { SubscriberGateway } from './gateway/subscriber.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [ChatGateway, SubscriberGateway],
})
export class ChatModule {}
