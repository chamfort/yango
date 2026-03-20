import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany({
      include: { distributeur: true },
    });
  }

  async findByZone(zone: string) {
    // Basic filter by city (ville) for now as requested in specs
    return this.prisma.product.findMany({
      where: {
        distributeur: {
          ville: zone,
        },
      },
      include: { distributeur: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { distributeur: true },
    });
  }

  async create(data: any) {
    return this.prisma.product.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
