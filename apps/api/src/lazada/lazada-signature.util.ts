// apps/api/src/lazada/lazada-signature.util.ts
import * as crypto from 'crypto';

/**
 * Lazada Signature Algorithm
 *
 * 1. Sort all parameters (excluding 'sign') alphabetically by key.
 * 2. Concatenate parameter keys and values: key1value1key2value2...
 * 3. Prepend the API name (path) to the concatenated string.
 * 4. Use HMAC-SHA256 with the app_secret to sign the resulting string.
 * 5. Convert the signature to uppercase hex string.
 *
 * Reference: https://open.lazada.com/apps/doc/doc?nodeId=10452&docId=108068
 */
export function sign(
  appSecret: string,
  apiName: string,
  params: Record<string, string | number>,
): string {
  // 1. Sort parameters by key
  const sortedKeys = Object.keys(params).sort();

  // 2. Concatenate key + value
  let baseString = apiName;
  for (const key of sortedKeys) {
    baseString += `${key}${params[key]}`;
  }

  // 3. HMAC-SHA256
  return crypto
    .createHmac('sha256', appSecret)
    .update(baseString)
    .digest('hex')
    .toUpperCase();
}
