import { Controller, Post, Body, UseGuards, Param, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('initiate')
  async initiate(@Body() data: { orderId: string, phone: string, amount: number }) {
    return this.paymentsService.initiate(data.orderId, data.phone, data.amount);
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify/:orderId')
  async verify(@Param('orderId') orderId: string) {
    // This could also be a webhook from a real provider
    return this.paymentsService.verify(orderId);
  }
}
