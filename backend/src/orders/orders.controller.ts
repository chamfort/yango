import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  async create(@Body() body: any) {
    return this.ordersService.create(body);
  }

  @Get()
  async findAll() {
    return this.ordersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async findByUser(@Req() req) {
    return this.ordersService.findByUser(req.user.userId, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Get('transporteur')
  async findForTransporteur(@Req() req) {
    return this.ordersService.findByUser(req.user.userId, 'transporteur');
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: any) {
    return this.ordersService.updateStatut(id, status);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/assign-transporteur')
  async assignTransporteur(
    @Param('id') id: string,
    @Body('transporteur_id') transporteur_id: string,
  ) {
    return this.ordersService.assignTransporteur(id, transporteur_id);
  }
}
