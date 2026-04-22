// apps/api/src/shopee/shopee-signature.util.ts
import * as crypto from 'crypto';

/**
 * Public signature — used for:
 * - Auth link generation (/api/v1/shop/auth_partner)
 * - Token exchange (/api/v2/auth/token/get)
 * - Token refresh (/api/v2/auth/access_token/get)
 *
 * Formula: hmac_sha256(partner_key, partner_id + path + timestamp)
 */
export function signPublic(
  partnerKey: string,
  partnerId: number,
  path: string,
  timestamp: number,
): string {
  const baseString = `${partnerId}${path}${timestamp}`;
  return crypto.createHmac('sha256', partnerKey).update(baseString).digest('hex');
}

/**
 * Authenticated signature — used for all v2 API calls that require a token.
 *
 * Formula: hmac_sha256(partner_key, partner_id + path + timestamp + access_token + shop_id)
 * Reference: https://open.shopee.com/developer-guide/12
 */
export function signAuthenticated(
  partnerKey: string,
  partnerId: number,
  path: string,
  timestamp: number,
  accessToken: string,
  shopId: number,
): string {
  const baseString = `${partnerId}${path}${timestamp}${accessToken}${shopId}`;
  return crypto.createHmac('sha256', partnerKey).update(baseString).digest('hex');
}
