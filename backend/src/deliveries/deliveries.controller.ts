import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';

@Controller('deliveries')
export class DeliveriesController {
  constructor(private deliveriesService: DeliveriesService) {}

  @Post()
  async create(@Body() body: any) {
    return this.deliveriesService.create(body);
  }

  @Get()
  async findAll() {
    return this.deliveriesService.findAll();
  }

  @Patch(':id/location')
  async updateLocation(@Param('id') id: string, @Body() body: { lat: number; lng: number }) {
    return this.deliveriesService.updateLocation(id, body.lat, body.lng);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: any) {
    return this.deliveriesService.updateStatus(id, status);
  }
}
