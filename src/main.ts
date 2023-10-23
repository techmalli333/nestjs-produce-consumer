import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RMQ_ORDER_QUEUE, RMQ_PAYMENT_QUEUE } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // creating multiple queues
  for (const queue of [RMQ_ORDER_QUEUE, RMQ_PAYMENT_QUEUE]) {
    await app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue,
        noAck: false, // Disable automatic acknowledgment
        queueOptions: {
          durable: false, // Set it to false to match the existing non-durable queue.
        },
      },
    });
  }
  app.startAllMicroservices();

  await app.listen(3000);
}
bootstrap();
