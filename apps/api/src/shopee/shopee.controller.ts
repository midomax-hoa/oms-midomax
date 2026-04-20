// apps/api/src/shopee/shopee.controller.ts
import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Res,
  Req,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ShopeeService } from './shopee.service';
import { ShopeeTokenStore } from './shopee-token.store';
import { WebhookEventDto } from './dto/webhook-event.dto';

@Controller('shopee')
export class ShopeeController {
  private readonly logger = new Logger(ShopeeController.name);

  constructor(
    private readonly shopeeService: ShopeeService,
    private readonly tokenStore: ShopeeTokenStore,
  ) {}

  /**
   * GET /api/shopee/auth-link
   * Generates a time-sensitive Shopee OAuth link for the shop owner to authorize.
   */
  @Get('auth-link')
  generateAuthLink(): { url: string } {
    const url = this.shopeeService.generateAuthLink();
    this.logger.log(`Auth link generated: ${url}`);
    return { url };
  }

  /**
   * GET /api/shopee/callback?code=xxx&shop_id=yyy
   * Shopee redirects here after shop owner authorizes the app.
   * Exchanges the one-time code for access + refresh tokens.
   */
  @Get('callback')
  async handleCallback(
    @Query('code') code: string,
    @Query('shop_id') shopIdStr: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!code || !shopIdStr) {
      throw new BadRequestException('Missing required query params: code, shop_id');
    }

    const shopId = parseInt(shopIdStr, 10);
    if (isNaN(shopId)) {
      throw new BadRequestException('shop_id must be a number');
    }

    await this.shopeeService.exchangeCodeForToken(code, shopId);

    const frontendUrl = this.shopeeService.getFrontendUrl();
    res.redirect(`${frontendUrl}/orders`);
  }

  /**
   * POST /api/shopee/webhook
   * Receives Shopee push notifications (new orders, status changes, etc.).
   *
   * MVP: Logs the full payload. No DB writes.
   *
   * ⚠️ TODO: Implement proper signature verification before production.
   * Signature header format to be confirmed against:
   * https://open.shopee.com/developer-guide/12
   */
  @Post('webhook')
  handleWebhook(
    @Body() body: WebhookEventDto,
    @Req() _req: Request,
  ): { received: boolean } {
    this.logger.log(
      `📦 Shopee Webhook received — code: ${body.code}, shop_id: ${body.shop_id}, timestamp: ${body.timestamp}`,
    );
    this.logger.log(`Webhook data: ${JSON.stringify(body.data)}`);
    return { received: true };
  }

  /**
   * GET /api/shopee/shops
   * Lists all shops currently connected (in-memory).
   * Used by the frontend to know if any shop is authorized.
   */
  @Get('shops')
  getConnectedShops(): { shops: Array<{ shopId: number; isExpired: boolean }> } {
    return { shops: this.shopeeService.getConnectedShops() };
  }
}
