// apps/api/src/lazada/lazada.module.ts
import { Module } from '@nestjs/common';
import { LazadaController } from './lazada.controller';
import { LazadaService } from './lazada.service';
import { LazadaTokenStore } from './lazada-token.store';

@Module({
  controllers: [LazadaController],
  providers: [LazadaService, LazadaTokenStore],
  exports: [LazadaService, LazadaTokenStore],
})
export class LazadaModule {}
