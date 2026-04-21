// apps/api/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation';
import { ShopeeModule } from './shopee/shopee.module';
import { LazadaModule } from './lazada/lazada.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../../.env',
      isGlobal: true,
      validate,
    }),
    ShopeeModule,
    LazadaModule,
    OrdersModule,
    ProductsModule,
  ],
})
export class AppModule {}
