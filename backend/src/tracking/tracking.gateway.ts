import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { DeliveriesService } from '../deliveries/deliveries.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly deliveriesService: DeliveriesService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinOrder')
  handleJoinOrder(
    @MessageBody() data: { orderId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`order_${data.orderId}`);
    console.log(`Client joined order: ${data.orderId}`);
  }

  @SubscribeMessage('updateLocation')
  async handleUpdateLocation(
    @MessageBody() data: { deliveryId: string; lat: number; lng: number },
  ) {
    // Update location in database
    await this.deliveriesService.updateLocation(data.deliveryId, data.lat, data.lng);

    // Broadcast to everyone watching this order
    // We assume deliveryId is linked to orderId. For simplicity, broadcast to order room.
    const delivery = await this.deliveriesService.findOne(data.deliveryId);
    if (delivery) {
      this.server.to(`order_${delivery.commande_id}`).emit('locationUpdate', {
        lat: data.lat,
        lng: data.lng,
      });
    }
  }
}
