import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { RedisIoAdapter } from './@shared/adapter/RedisIoAdapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const redisIoAdapter = new RedisIoAdapter(app);
  // await redisIoAdapter.connectToRedis();

  // app.useWebSocketAdapter(redisIoAdapter);

  await app.listen(3000);
}
bootstrap().then((r) => console.log(`bootstrap ${r}`));
