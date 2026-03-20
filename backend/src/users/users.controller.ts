import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile/:phone')
  findByPhone(@Param('phone') phone: string) {
    return this.usersService.findByPhone(phone);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('availability')
  updateAvailability(@Body() data: { phone: string; est_disponible: boolean }) {
    return this.usersService.updateAvailability(data.phone, data.est_disponible);
  }

  @UseGuards(JwtAuthGuard)
  @Get('available-transporteurs')
  findAvailableTransporteurs() {
    return this.usersService.findAvailableTransporteurs();
  }

  @UseGuards(JwtAuthGuard)
  @Get('pending-kyc')
  findAllPendingKYC() {
    return this.usersService.findAllPendingKYC();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/kyc-status')
  updateKYCStatus(
    @Param('id') id: string,
    @Body() data: { statut: string; kycNotes?: string },
  ) {
    return this.usersService.updateKYCStatus(id, data.statut, data.kycNotes);
  }
}
