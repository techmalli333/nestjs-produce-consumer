import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ProducerController } from './producer/producer.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly producerService: ProducerController,
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
}
