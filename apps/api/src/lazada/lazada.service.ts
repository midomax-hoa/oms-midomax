// apps/api/src/lazada/lazada.service.ts
import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign } from './lazada-signature.util';
import { LazadaTokenData, LazadaTokenStore } from './lazada-token.store';

// ── Lazada API response shapes ────────────────────────────────────────────────

interface LazadaTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  account: string;
  country: string;
  account_id: string;
  code: string; // "0" means success
  request_id: string;
  message?: string;
}

export interface LazadaOrder {
  order_id: number;
  order_number: string;
  statuses: string[];
  created_at: string;
  updated_at: string;
  customer_first_name: string;
  customer_last_name: string;
  price: string;
  payment_method: string;
  items_count: number;
}

export interface LazadaProduct {
  item_id: number;
  attributes: {
    name: string;
    description: string;
  };
  skus: Array<{
    SkuId: string;
    SellerSku: string;
    price: number;
    available: number;
    Images: string[];
  }>;
}

@Injectable()
export class LazadaService {
  private readonly logger = new Logger(LazadaService.name);

  private readonly appKey: string;
  private readonly appSecret: string;
  private readonly apiHost: string;
  private readonly redirectUrl: string;
  private readonly frontendUrl: string;

  constructor(
    private readonly config: ConfigService,
    private readonly tokenStore: LazadaTokenStore,
  ) {
    this.appKey = this.config.get<string>('LAZADA_APP_KEY')!;
    this.appSecret = this.config.get<string>('LAZADA_APP_SECRET')!;
    this.apiHost = this.config.get<string>('LAZADA_API_HOST')!;
    this.redirectUrl = this.config.get<string>('LAZADA_REDIRECT_URL')!;
    this.frontendUrl = this.config.get<string>('LAZADA_FRONTEND_URL')!;
  }

  // ── Auth ───────────────────────────────────────────────────────────────────

  generateAuthLink(): string {
    const url = 'https://auth.lazada.com/oauth/authorize';
    const params = new URLSearchParams({
      response_type: 'code',
      force_auth: 'true',
      redirect_uri: this.redirectUrl,
      client_id: this.appKey,
    });

    return `${url}?${params}`;
  }

  async exchangeCodeForToken(code: string): Promise<void> {
    const apiName = '/auth/token/create';
    const timestamp = Date.now().toString();

    const params: Record<string, string | number> = {
      app_key: this.appKey,
      timestamp,
      sign_method: 'sha256',
      code,
    };

    const signature = sign(this.appSecret, apiName, params);
    
    const url = `${this.apiHost}${apiName}?${new URLSearchParams({
      ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
      sign: signature,
    })}`;

    const response = await fetch(url, { method: 'POST' });

    if (!response.ok) {
      throw new BadRequestException(`Lazada token exchange failed: HTTP ${response.status}`);
    }

    const data = (await response.json()) as LazadaTokenResponse;

    if (data.code !== '0') {
      throw new BadRequestException(`Lazada error: ${data.message || 'Unknown error'}`);
    }

    const now = Math.floor(Date.now() / 1000);
    const tokenData: LazadaTokenData = {
      sellerId: data.account_id,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      accessTokenExpireAt: now + data.expires_in,
      refreshTokenExpireAt: now + data.refresh_expires_in,
      account: data.account,
      country: data.country,
    };

    this.tokenStore.set(tokenData);
    this.logger.log(`✅ Lazada account ${data.account} authorized.`);
  }

  getFrontendUrl(): string {
    return this.frontendUrl;
  }

  getConnectedShops(): Array<{ sellerId: string; account: string; isExpired: boolean }> {
    return this.tokenStore.getAll().map((s) => ({
      sellerId: s.sellerId,
      account: s.account,
      isExpired: this.tokenStore.isAccessTokenExpired(s.sellerId),
    }));
  }

  // ── Orders ─────────────────────────────────────────────────────────────────

  async getOrders(sellerId: string): Promise<LazadaOrder[]> {
    const apiName = '/orders/get';
    const res = await this.callLazadaApi<{
      data: { orders: LazadaOrder[] };
      code: string;
      message?: string;
    }>(apiName, sellerId, {
      update_after: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    });

    return res.data?.orders || [];
  }

  // ── Products ───────────────────────────────────────────────────────────────

  async getProducts(sellerId: string): Promise<LazadaProduct[]> {
    const apiName = '/products/get';
    const res = await this.callLazadaApi<{
      data: { products: LazadaProduct[] };
      code: string;
      message?: string;
    }>(apiName, sellerId, {
      filter: 'all',
    });

    return res.data?.products || [];
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private async callLazadaApi<T>(
    apiName: string,
    sellerId: string,
    queryParams: Record<string, string | number> = {},
  ): Promise<T> {
    const tokenData = this.tokenStore.get(sellerId);
    if (!tokenData) {
      throw new NotFoundException(`Seller ${sellerId} not connected.`);
    }

    // Refresh token logic would go here if needed, keeping it simple for MVP
    
    const timestamp = Date.now().toString();
    const commonParams: Record<string, string | number> = {
      app_key: this.appKey,
      timestamp,
      sign_method: 'sha256',
      access_token: tokenData.accessToken,
      ...queryParams,
    };

    const signature = sign(this.appSecret, apiName, commonParams);

    const params = new URLSearchParams({
      ...Object.fromEntries(
        Object.entries(commonParams).map(([k, v]) => [k, String(v)]),
      ),
      sign: signature,
    });

    const url = `${this.apiHost}${apiName}?${params}`;
    this.logger.debug(`→ Lazada API: ${apiName}`);

    const response = await fetch(url);
    if (!response.ok) {
      throw new InternalServerErrorException(
        `Lazada API error on ${apiName}: HTTP ${response.status}`,
      );
    }

    const data = (await response.json()) as any;
    if (data.code !== '0') {
      this.logger.error(`Lazada API Error: ${data.message}`);
      // Special case: if token expired, we might want to handle it
    }

    return data as T;
  }
}
