// apps/api/src/products/products.controller.ts
import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('shopee/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * GET /api/shopee/products
   *
   * Query params:
   *   shop_id?  — auto-picks first connected shop if omitted
   *   offset    — default 0, for pagination
   *   page_size — default 20, max 50
   */
  @Get()
  async getProducts(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('page_size', new DefaultValuePipe(20), ParseIntPipe) pageSize: number,
    @Query('shop_id') shopIdStr?: string,
  ) {
    const shopId = shopIdStr ? parseInt(shopIdStr, 10) : undefined;
    return this.productsService.getShopeeProducts(shopId, offset, pageSize);
  }
}
