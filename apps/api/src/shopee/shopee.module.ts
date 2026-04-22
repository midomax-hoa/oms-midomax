// apps/api/src/shopee/shopee.module.ts
import { Module } from '@nestjs/common';
import { ShopeeController } from './shopee.controller';
import { ShopeeService } from './shopee.service';
import { ShopeeTokenStore } from './shopee-token.store';

@Module({
  controllers: [ShopeeController],
  providers: [ShopeeService, ShopeeTokenStore],
  exports: [ShopeeService, ShopeeTokenStore],
})
export class ShopeeModule {}
