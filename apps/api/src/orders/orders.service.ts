// apps/api/src/orders/orders.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { ShopeeService, ShopeeOrdersResult } from '../shopee/shopee.service';
import { ShopeeTokenStore } from '../shopee/shopee-token.store';

@Injectable()
export class OrdersService {
  constructor(
    private readonly shopeeService: ShopeeService,
    private readonly tokenStore: ShopeeTokenStore,
  ) {}

  async getShopeeOrders(
    shopIdParam: number | undefined,
    pageSize: number,
    cursor?: string,
  ): Promise<ShopeeOrdersResult> {
    const shopId = shopIdParam ?? this.tokenStore.getFirstShopId();

    if (!shopId) {
      throw new NotFoundException(
        'No Shopee shop connected. Please authorize via /api/shopee/auth-link',
      );
    }

    return this.shopeeService.getOrders(shopId, { pageSize, cursor });
  }
}
