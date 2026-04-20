// apps/api/src/orders/orders.module.ts
import { Module } from '@nestjs/common';
import { ShopeeModule } from '../shopee/shopee.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [ShopeeModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
