// apps/api/src/shopee/shopee-token.store.ts
import { Injectable } from '@nestjs/common';

export interface ShopeeTokenData {
  shopId: number;
  accessToken: string;
  refreshToken: string;
  /** Unix timestamp (seconds) when access_token expires */
  accessTokenExpireAt: number;
  /** Unix timestamp (seconds) when refresh_token expires (~30 days) */
  refreshTokenExpireAt: number;
}

/**
 * In-memory token store for Shopee access/refresh tokens.
 *
 * ⚠️ MVP NOTE: Tokens are lost on server restart.
 * Admin must re-authorize each shop after a restart.
 * Production should migrate this to Redis or a database.
 */
@Injectable()
export class ShopeeTokenStore {
  private readonly store = new Map<number, ShopeeTokenData>();

  set(data: ShopeeTokenData): void {
    this.store.set(data.shopId, data);
  }

  get(shopId: number): ShopeeTokenData | undefined {
    return this.store.get(shopId);
  }

  getAll(): ShopeeTokenData[] {
    return Array.from(this.store.values());
  }

  /** Returns the first connected shop ID, used for auto-pick in single-shop MVP. */
  getFirstShopId(): number | undefined {
    return this.store.keys().next().value as number | undefined;
  }

  hasShop(shopId: number): boolean {
    return this.store.has(shopId);
  }

  /**
   * Returns true if access_token is expired or within 60 seconds of expiry.
   * The 60s buffer prevents race conditions on near-expiry tokens.
   */
  isAccessTokenExpired(shopId: number): boolean {
    const data = this.store.get(shopId);
    if (!data) return true;
    const nowSeconds = Math.floor(Date.now() / 1000);
    return nowSeconds >= data.accessTokenExpireAt - 60;
  }

  delete(shopId: number): void {
    this.store.delete(shopId);
  }
}
