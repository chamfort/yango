import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByPhone(phone: string) {
    return (this.prisma as any).user.findUnique({
      where: { phone },
    });
  }

  async updateAvailability(phone: string, est_disponible: boolean) {
    return (this.prisma as any).user.update({
      where: { phone },
      data: { est_disponible },
    });
  }

  async findAvailableTransporteurs() {
    return (this.prisma as any).user.findMany({
      where: {
        role: 'transporteur',
        est_disponible: true,
      },
    });
  }

  async findAllPendingKYC() {
    return (this.prisma as any).user.findMany({
      where: {
        statut: 'en_attente_validation',
      },
    });
  }

  async updateKYCStatus(id: string, statut: string, kycNotes?: string) {
    return (this.prisma as any).user.update({
      where: { id },
      data: { 
        statut: statut as any,
        kycNotes 
      },
    });
  }

  async create(data: any) {
    return (this.prisma as any).user.create({
      data,
    });
  }
}
