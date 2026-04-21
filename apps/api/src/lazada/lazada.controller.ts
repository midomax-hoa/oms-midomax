// apps/api/src/lazada/lazada.controller.ts
import {
  Controller,
  Get,
  Query,
  Res,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import type { Response } from 'express';
import { LazadaService } from './lazada.service';
import { LazadaTokenStore } from './lazada-token.store';

@Controller('lazada')
export class LazadaController {
  private readonly logger = new Logger(LazadaController.name);

  constructor(
    private readonly lazadaService: LazadaService,
    private readonly tokenStore: LazadaTokenStore,
  ) {}

  /**
   * GET /api/lazada/auth-link
   * Generates a Lazada OAuth link.
   */
  @Get('auth-link')
  generateAuthLink(): { url: string } {
    const url = this.lazadaService.generateAuthLink();
    this.logger.log(`Lazada Auth link generated: ${url}`);
    return { url };
  }

  /**
   * GET /api/lazada/callback
   * Lazada redirects here after authorization.
   */
  @Get('callback')
  async handleCallback(
    @Query('code') code: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!code) {
      throw new BadRequestException('Missing required query param: code');
    }

    await this.lazadaService.exchangeCodeForToken(code);

    const frontendUrl = this.lazadaService.getFrontendUrl();
    res.redirect(`${frontendUrl}/orders`);
  }

  /**
   * GET /api/lazada/shops
   * Lists all connected Lazada sellers.
   */
  @Get('shops')
  getConnectedShops(): { shops: Array<{ sellerId: string; account: string; isExpired: boolean }> } {
    return { shops: this.lazadaService.getConnectedShops() };
  }

  /**
   * GET /api/lazada/orders
   */
  @Get('orders')
  async getOrders(@Query('seller_id') sellerId?: string) {
    const id = sellerId || this.tokenStore.getFirstSellerId();
    if (!id) throw new NotFoundException('No Lazada seller connected.');
    
    const orders = await this.lazadaService.getOrders(id);
    return { data: orders };
  }

  /**
   * GET /api/lazada/products
   */
  @Get('products')
  async getProducts(@Query('seller_id') sellerId?: string) {
    const id = sellerId || this.tokenStore.getFirstSellerId();
    if (!id) throw new NotFoundException('No Lazada seller connected.');
    
    const products = await this.lazadaService.getProducts(id);
    return { data: products };
  }
}
