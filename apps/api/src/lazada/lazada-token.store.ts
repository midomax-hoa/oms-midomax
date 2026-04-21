// apps/api/src/lazada/lazada-token.store.ts
import { Injectable } from '@nestjs/common';

export interface LazadaTokenData {
  sellerId: string;
  accessToken: string;
  refreshToken: string;
  /** Unix timestamp (seconds) when access_token expires */
  accessTokenExpireAt: number;
  /** Unix timestamp (seconds) when refresh_token expires */
  refreshTokenExpireAt: number;
  account: string;
  country: string;
}

/**
 * In-memory token store for Lazada access/refresh tokens.
 *
 * ⚠️ MVP NOTE: Tokens are lost on server restart.
 */
@Injectable()
export class LazadaTokenStore {
  private readonly store = new Map<string, LazadaTokenData>();

  set(data: LazadaTokenData): void {
    this.store.set(data.sellerId, data);
  }

  get(sellerId: string): LazadaTokenData | undefined {
    return this.store.get(sellerId);
  }

  getAll(): LazadaTokenData[] {
    return Array.from(this.store.values());
  }

  hasSeller(sellerId: string): boolean {
    return this.store.has(sellerId);
  }

  isAccessTokenExpired(sellerId: string): boolean {
    const data = this.store.get(sellerId);
    if (!data) return true;
    const nowSeconds = Math.floor(Date.now() / 1000);
    return nowSeconds >= data.accessTokenExpireAt - 60;
  }

  delete(sellerId: string): void {
    this.store.delete(sellerId);
  }

  getFirstSellerId(): string | undefined {
    return this.store.keys().next().value as string | undefined;
  }
}
