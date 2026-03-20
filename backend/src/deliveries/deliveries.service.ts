import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DeliveryStatus } from '@prisma/client';

@Injectable()
export class DeliveriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return (this.prisma as any).delivery.create({
      data,
      include: {
        commande: true,
        transporteur: true,
      },
    });
  }

  async updateLocation(id: string, lat: number, lng: number) {
    return (this.prisma as any).delivery.update({
      where: { id },
      data: {
        lat_actuelle: lat,
        lng_actuelle: lng,
      },
    });
  }

  async updateStatus(id: string, statut: any) {
    return (this.prisma as any).delivery.update({
      where: { id },
      data: { 
        statut,
        ...(statut === 'en_route' ? { heure_depart: new Date() } : {}),
        ...(statut === 'completee' ? { heure_arrivee: new Date() } : {}),
      },
    });
  }

  async findOne(id: string) {
    return (this.prisma as any).delivery.findUnique({
      where: { id },
      include: {
        commande: true,
        transporteur: true,
      },
    });
  }

  async findAll() {
    return (this.prisma as any).delivery.findMany({
      include: {
        commande: true,
        transporteur: true,
      },
    });
  }
}
