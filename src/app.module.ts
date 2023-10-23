import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ProducerService } from './producer/producer.service';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  ORDER_SERVICE,
  PAYMENT_SERVICE,
  RMQ_ORDER_QUEUE,
  RMQ_PAYMENT_QUEUE,
} from './constants';

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
  controllers: [AppController],
  providers: [AppService, ProducerService],
})
export class AppModule {}
