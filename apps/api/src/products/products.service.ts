// apps/api/src/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { ShopeeService, ShopeeProductsResult } from '../shopee/shopee.service';
import { ShopeeTokenStore } from '../shopee/shopee-token.store';

@Injectable()
export class ProductsService {
  constructor(
    private readonly shopeeService: ShopeeService,
    private readonly tokenStore: ShopeeTokenStore,
  ) {}

  async getShopeeProducts(
    shopIdParam: number | undefined,
    offset: number,
    pageSize: number,
  ): Promise<ShopeeProductsResult> {
    const shopId = shopIdParam ?? this.tokenStore.getFirstShopId();

    if (!shopId) {
      throw new NotFoundException(
        'No Shopee shop connected. Please authorize via /api/shopee/auth-link',
      );
    }

    return this.shopeeService.getProducts(shopId, { offset, pageSize });
  }
}
