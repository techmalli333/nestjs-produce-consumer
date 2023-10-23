import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ProducerController } from './producer/producer.service';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  ORDER_SERVICE,
  PAYMENT_SERVICE,
  RMQ_ORDER_QUEUE,
  RMQ_PAYMENT_QUEUE,
} from './constants';
import { ConsumerController } from './consumer/consumer.controller';

@Module({
  imports: [
    // to consume data from queue
    ClientsModule.register([
      {
        name: ORDER_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: RMQ_ORDER_QUEUE,
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: PAYMENT_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: RMQ_PAYMENT_QUEUE,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [AppController, ConsumerController],
  providers: [AppService, ProducerController],
})
export class AppModule {}
