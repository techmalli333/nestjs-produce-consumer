import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ORDER_SERVICE, PAYMENT_SERVICE } from 'src/constants';

@Injectable()
export class ProducerController {
  constructor(
    @Inject(ORDER_SERVICE) private orderClient: ClientProxy,
    @Inject(PAYMENT_SERVICE) private paymentClient: ClientProxy,
  ) {}

  async createOrderMessageAsync() {
    const message = await this.orderClient.send(
      { cmd: 'order-created' },
      'order created using message pattern',
    );

    return message.subscribe();
  }

  async publishOrderEvent() {
    this.orderClient.emit('order-created', {
      id: '1',
      data: 'order created',
    });
  }

  async createPaymentMessageAsync() {
    try {
      const message = await this.paymentClient.send(
        { cmd: 'payment-created' },
        'Progressive Coder',
      );
      return message.subscribe();
    } catch (error) {
      // Handle the error here
      console.error('An error occurred:', error);
    }
  }
}
