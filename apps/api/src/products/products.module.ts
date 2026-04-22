// apps/api/src/products/products.module.ts
import { Module } from '@nestjs/common';
import { ShopeeModule } from '../shopee/shopee.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [ShopeeModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
