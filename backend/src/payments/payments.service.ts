import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(private prisma: PrismaService) {}

  async initiate(orderId: string, phone: string, amount: number) {
    this.logger.log(`Initiating payment for order ${orderId} - amount: ${amount} FCFA to ${phone}`);
    
    // Simulate payment processing delay
    setTimeout(async () => {
      await this.verify(orderId);
    }, 5000);

    return {
      status: 'pending',
      transactionId: `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      message: 'Veuillez valider le paiement sur votre téléphone',
    };
  }

  async verify(orderId: string) {
    this.logger.log(`Verifying payment for order ${orderId}`);
    
    // Auto-confirm for placeholder demo
    const order = await (this.prisma as any).order.update({
      where: { id: orderId },
      data: { statut: 'confirmee' },
    });

    this.logger.log(`Order ${orderId} confirmed after successful payment`);
    
    return {
      status: 'success',
      order,
    };
  }
}
