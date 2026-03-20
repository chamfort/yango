import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const { items, ...orderData } = data;
    return (this.prisma as any).order.create({
      data: {
        ...orderData,
        items: {
          create: items,
        },
      },
      include: {
        items: true,
        client: true,
        distributeur: true,
      },
    });
  }

  async findAll() {
    return (this.prisma as any).order.findMany({
      include: {
        items: true,
        client: true,
        distributeur: true,
        transporteur: true,
      },
    });
  }

  async findByUser(userId: string, role: string) {
    let where = {};
    if (role === 'client') where = { client_id: userId };
    else if (role === 'petit_depot') where = { distributeur_id: userId };
    else if (role === 'transporteur') where = { transporteur_id: userId };

    return (this.prisma as any).order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        client: true,
        distributeur: true,
        transporteur: true,
      },
    });
  }

  async updateStatut(id: string, statut: any) {
    return (this.prisma as any).order.update({
      where: { id },
      data: { statut },
    });
  }

  async assignTransporteur(id: string, transporteur_id: string) {
    return (this.prisma as any).order.update({
      where: { id },
      data: { 
        transporteur_id,
        statut: 'confirmee' // Update to confirmed if a transporter is assigned
      },
      include: {
        transporteur: true
      }
    });
  }
}
