import { Module } from '@nestjs/common';
import { TrackingGateway } from './tracking.gateway';
import { DeliveriesModule } from '../deliveries/deliveries.module';

@Module({
  imports: [DeliveriesModule],
  providers: [TrackingGateway],
})
export class TrackingModule {}
