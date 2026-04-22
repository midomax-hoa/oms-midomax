// apps/api/src/shopee/shopee.service.ts
import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { signPublic, signAuthenticated } from './shopee-signature.util';
import { ShopeeTokenData, ShopeeTokenStore } from './shopee-token.store';

// ── Shopee API response shapes ────────────────────────────────────────────────

interface ShopeeTokenResponse {
  access_token: string;
  refresh_token: string;
  /** Seconds until access_token expires (typically 14400 = 4h) */
  expire_in: number;
  error?: string;
  message?: string;
}

interface ShopeeOrderSn {
  order_sn: string;
}

export interface ShopeeOrderDetail {
  order_sn: string;
  order_status: string;
  create_time: number;
  update_time: number;
  buyer_username: string;
  buyer_user_id: number;
  total_amount: string;
  currency: string;
  payment_method: string;
  item_list: ShopeeOrderItem[];
  recipient_address: {
    name: string;
    phone: string;
    town: string;
    district: string;
    city: string;
    state: string;
    region: string;
    zipcode: string;
    full_address: string;
  };
}

interface ShopeeOrderItem {
  item_id: number;
  item_name: string;
  item_sku: string;
  model_name: string;
  model_quantity_purchased: number;
  model_original_price: number;
  model_discounted_price: number;
  image_info: { image_url: string };
}

export interface ShopeeProductDetail {
  item_id: number;
  item_name: string;
  description: string;
  item_status: string;
  price_info: Array<{ original_price: number; current_price: number }>;
  image: { image_url_list: string[] };
  stock_info: Array<{ stock_type: number; stock_location_id: string; normal_stock: number }>;
}

export interface ShopeeOrdersResult {
  orders: ShopeeOrderDetail[];
  more: boolean;
  nextCursor: string;
}

export interface ShopeeProductsResult {
  products: ShopeeProductDetail[];
  hasNextPage: boolean;
  nextOffset: number;
  totalCount: number;
}

// ── Service ───────────────────────────────────────────────────────────────────

@Injectable()
export class ShopeeService {
  private readonly logger = new Logger(ShopeeService.name);

  private readonly partnerId: number;
  private readonly partnerKey: string;
  private readonly apiHost: string;
  private readonly redirectUrl: string;
  private readonly frontendUrl: string;

  constructor(
    private readonly config: ConfigService,
    private readonly tokenStore: ShopeeTokenStore,
  ) {
    this.partnerId = this.config.get<number>('SHOPEE_PARTNER_ID')!;
    this.partnerKey = this.config.get<string>('SHOPEE_PARTNER_KEY')!;
    this.apiHost = this.config.get<string>('SHOPEE_API_HOST')!;
    this.redirectUrl = this.config.get<string>('SHOPEE_REDIRECT_URL')!;
    this.frontendUrl = this.config.get<string>('SHOPEE_FRONTEND_URL')!;
  }

  // ── Auth ───────────────────────────────────────────────────────────────────

  generateAuthLink(): string {
    const path = '/api/v2/shop/auth_partner';
    const timestamp = Math.floor(Date.now() / 1000);
    const sign = signPublic(this.partnerKey, this.partnerId, path, timestamp);

    const params = new URLSearchParams({
      partner_id: String(this.partnerId),
      timestamp: String(timestamp),
      sign,
      redirect: this.redirectUrl,
    });

    return `${this.apiHost}${path}?${params}`;
  }

  async exchangeCodeForToken(code: string, shopId: number): Promise<void> {
    const path = '/api/v2/auth/token/get';
    const timestamp = Math.floor(Date.now() / 1000);
    const sign = signPublic(this.partnerKey, this.partnerId, path, timestamp);

    const url = `${this.apiHost}${path}?partner_id=${this.partnerId}&timestamp=${timestamp}&sign=${sign}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, shop_id: shopId, partner_id: this.partnerId }),
    });

    if (!response.ok) {
      throw new BadRequestException(`Shopee token exchange failed: HTTP ${response.status}`);
    }

    const data = (await response.json()) as ShopeeTokenResponse;

    if (data.error) {
      throw new BadRequestException(`Shopee error: ${data.error} — ${data.message}`);
    }

    const now = Math.floor(Date.now() / 1000);
    const tokenData: ShopeeTokenData = {
      shopId,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      accessTokenExpireAt: now + data.expire_in,
      refreshTokenExpireAt: now + 30 * 24 * 60 * 60, // 30 days
    };

    this.tokenStore.set(tokenData);
    this.logger.log(
      `✅ Shop ${shopId} authorized. Token expires in ${data.expire_in}s`,
    );
  }

  getFrontendUrl(): string {
    return this.frontendUrl;
  }

  getConnectedShops(): Array<{ shopId: number; isExpired: boolean }> {
    return this.tokenStore.getAll().map((s) => ({
      shopId: s.shopId,
      isExpired: this.tokenStore.isAccessTokenExpired(s.shopId),
    }));
  }

  // ── Orders ─────────────────────────────────────────────────────────────────

  async getOrders(
    shopId: number,
    options: { pageSize?: number; cursor?: string } = {},
  ): Promise<ShopeeOrdersResult> {
    const now = Math.floor(Date.now() / 1000);
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60;

    const listParams: Record<string, string | number> = {
      time_range_field: 'create_time',
      time_from: thirtyDaysAgo,
      time_to: now,
      page_size: options.pageSize ?? 20,
    };

    if (options.cursor) {
      listParams['cursor'] = options.cursor;
    }

    const listRes = await this.callShopeeApi<{
      response: { order_list: ShopeeOrderSn[]; more: boolean; next_cursor: string };
      error?: string;
    }>('/api/v2/order/get_order_list', shopId, listParams);

    const orderSnList = listRes.response.order_list.map((o) => o.order_sn);

    if (orderSnList.length === 0) {
      return { orders: [], more: false, nextCursor: '' };
    }

    const detailRes = await this.callShopeeApi<{
      response: { order_list: ShopeeOrderDetail[] };
    }>('/api/v2/order/get_order_detail', shopId, {
      order_sn_list: orderSnList.join(','),
      response_optional_fields:
        'buyer_user_id,buyer_username,item_list,total_amount,payment_method,recipient_address',
    });

    return {
      orders: detailRes.response.order_list,
      more: listRes.response.more,
      nextCursor: listRes.response.next_cursor ?? '',
    };
  }

  // ── Products ───────────────────────────────────────────────────────────────

  async getProducts(
    shopId: number,
    options: { offset?: number; pageSize?: number } = {},
  ): Promise<ShopeeProductsResult> {
    const listRes = await this.callShopeeApi<{
      response: {
        item: Array<{ item_id: number }>;
        total_count: number;
        has_next_page: boolean;
        next_offset: number;
      };
    }>('/api/v2/product/get_item_list', shopId, {
      offset: options.offset ?? 0,
      page_size: options.pageSize ?? 20,
      item_status: 'NORMAL',
    });

    const itemIds = listRes.response.item.map((i) => i.item_id);

    if (itemIds.length === 0) {
      return { products: [], hasNextPage: false, nextOffset: 0, totalCount: 0 };
    }

    const baseInfoRes = await this.callShopeeApi<{
      response: { item_list: ShopeeProductDetail[] };
    }>('/api/v2/product/get_item_base_info', shopId, {
      item_id_list: itemIds.join(','),
    });

    return {
      products: baseInfoRes.response.item_list,
      hasNextPage: listRes.response.has_next_page,
      nextOffset: listRes.response.next_offset ?? 0,
      totalCount: listRes.response.total_count,
    };
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private async refreshAccessToken(shopId: number): Promise<void> {
    const tokenData = this.tokenStore.get(shopId);
    if (!tokenData) throw new NotFoundException(`Shop ${shopId} not found in store`);

    const path = '/api/v2/auth/access_token/get';
    const timestamp = Math.floor(Date.now() / 1000);
    const sign = signPublic(this.partnerKey, this.partnerId, path, timestamp);

    const url = `${this.apiHost}${path}?partner_id=${this.partnerId}&timestamp=${timestamp}&sign=${sign}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        refresh_token: tokenData.refreshToken,
        shop_id: shopId,
        partner_id: this.partnerId,
      }),
    });

    if (!response.ok) {
      throw new InternalServerErrorException(
        `Failed to refresh token for shop ${shopId}: HTTP ${response.status}`,
      );
    }

    const data = (await response.json()) as ShopeeTokenResponse;

    if (data.error) {
      this.tokenStore.delete(shopId);
      throw new BadRequestException(
        `Refresh token invalid for shop ${shopId}. Please re-authorize.`,
      );
    }

    const now = Math.floor(Date.now() / 1000);
    this.tokenStore.set({
      ...tokenData,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      accessTokenExpireAt: now + data.expire_in,
    });

    this.logger.log(`🔄 Token refreshed for shop ${shopId}`);
  }

  private async callShopeeApi<T>(
    path: string,
    shopId: number,
    queryParams: Record<string, string | number> = {},
  ): Promise<T> {
    if (!this.tokenStore.hasShop(shopId)) {
      throw new NotFoundException(
        `Shop ${shopId} not connected. Please authorize first via /api/shopee/auth-link`,
      );
    }

    if (this.tokenStore.isAccessTokenExpired(shopId)) {
      await this.refreshAccessToken(shopId);
    }

    const tokenData = this.tokenStore.get(shopId)!;
    const timestamp = Math.floor(Date.now() / 1000);
    const sign = signAuthenticated(
      this.partnerKey,
      this.partnerId,
      path,
      timestamp,
      tokenData.accessToken,
      shopId,
    );

    const params = new URLSearchParams({
      partner_id: String(this.partnerId),
      timestamp: String(timestamp),
      access_token: tokenData.accessToken,
      shop_id: String(shopId),
      sign,
      ...Object.fromEntries(
        Object.entries(queryParams).map(([k, v]) => [k, String(v)]),
      ),
    });

    const url = `${this.apiHost}${path}?${params}`;
    this.logger.debug(`→ Shopee API: ${path}`);

    const response = await fetch(url);

    if (!response.ok) {
      throw new InternalServerErrorException(
        `Shopee API error on ${path}: HTTP ${response.status}`,
      );
    }

    const data = (await response.json()) as T;
    this.logger.log(`← Shopee ${path}: ${JSON.stringify(data)}`);

    return data;
  }
}
