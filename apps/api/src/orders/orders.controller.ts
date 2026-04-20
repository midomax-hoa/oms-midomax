// apps/api/src/orders/orders.controller.ts
import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  Optional,
} from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('shopee/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * GET /api/shopee/orders
   *
   * Query params:
   *   shop_id?  — auto-picks first connected shop if omitted
   *   page_size — default 20, max 50
   *   cursor    — pagination cursor from previous response
   */
  @Get()
  async getOrders(
    @Query('page_size', new DefaultValuePipe(20), ParseIntPipe) pageSize: number,
    @Query('cursor') cursor?: string,
    @Query('shop_id') shopIdStr?: string,
  ) {
    const shopId = shopIdStr ? parseInt(shopIdStr, 10) : undefined;
    return this.ordersService.getShopeeOrders(shopId, pageSize, cursor);
  }
}
