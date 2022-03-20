import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { RedisIoAdapter } from './chat/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // error log
    // logger: ['error'],
  });
  await app.listen(3000);
  // Redis Adapter
  // app.useWebSocketAdapter(new RedisIoAdapter(app));
}
bootstrap().then((r) => console.log(`bootstrap ${r}`));
