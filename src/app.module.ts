import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { UserModule } from './user/user.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisConfigService } from './services/redis-config.service';

@Module({
  imports: [
    ChatModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      // Use different configurations according to different environments
      // envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    UsersModule,
    UserModule,
    RedisModule.forRootAsync({
      useClass: RedisConfigService,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
