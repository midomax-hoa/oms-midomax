// apps/api/src/shopee/dto/webhook-event.dto.ts
import { IsNumber, IsOptional } from 'class-validator';

export class WebhookEventDto {
  /** Shopee event code. Reference: https://open.shopee.com/developer-guide/12 */
  @IsNumber()
  code: number;

  @IsNumber()
  timestamp: number;

  @IsNumber()
  shop_id: number;

  /** Event-specific payload. Shape varies by code. */
  @IsOptional()
  data: unknown;
}
