import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller('consumer')
export class ConsumerController {
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
}
