import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ProducerService } from './producer/producer.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly producerService: ProducerService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // message pattern
  @Get('msg-order')
  async createOrderMessage(): Promise<any> {
    await this.producerService.createOrderMessageAsync();
    console.log('order created using message pattern');
  }

  // message pattern
  @Get('msg-payment')
  async createPaymentMessage(): Promise<any> {
    await this.producerService.createPaymentMessageAsync();
    console.log('payment created using message pattern');
  }

  // event pattern
  @Get('event-order')
  async publishOrderEvent(): Promise<any> {
    await this.producerService.publishOrderEvent();
    console.log('payment created using event pattern');
  }

  // order
  @MessagePattern({ cmd: 'order-created' })
  getCreateOrderMessageAsyncAsync(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    console.log('order data received through message pattern', { data });

    channel.ack(originalMsg);
  }

  @EventPattern('order-created')
  async handleOrderCreatedEvent(data: any) {
    console.log(data);
  }

  // payment
  @MessagePattern({ cmd: 'payment-created' })
  getCreatePaymentMessageAsyncAsync(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    try {
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      console.log('payment data received through message pattern', { data });

      channel.ack(originalMsg);
    } catch (error) {
      console.log({ error });
    }
  }
}
