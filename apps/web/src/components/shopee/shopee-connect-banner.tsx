// apps/web/src/components/shopee/shopee-connect-banner.tsx
import { useState } from 'react'
import { Button } from '@workspace/ui'
import { ShoppingBag, ExternalLink, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

interface ConnectedShop {
  shopId: number
  isExpired: boolean
}

interface ShopeeConnectBannerProps {
  connectedShops: ConnectedShop[]
  onConnect: () => void
  isLoading?: boolean
}

export function ShopeeConnectBanner({
  connectedShops,
  onConnect,
  isLoading = false,
}: ShopeeConnectBannerProps) {
  if (connectedShops.length > 0) {
    return (
      <div className="flex flex-col gap-2 mb-4">
        {connectedShops.map((shop) => (
          <div
            key={shop.shopId}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-card/60 border border-border/50"
          >
            {shop.isExpired ? (
              <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">
                Shop ID:{' '}
                <span className="font-mono text-primary">{shop.shopId}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {shop.isExpired
                  ? 'Token đã hết hạn — cần kết nối lại'
                  : 'Đang hoạt động'}
              </p>
            </div>
            {shop.isExpired && (
              <Button
                size="sm"
                variant="outline"
                onClick={onConnect}
                className="border-amber-400/40 text-amber-400 hover:bg-amber-400/10 shrink-0"
              >
                Kết nối lại
              </Button>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4 py-12 px-6 rounded-xl border border-dashed border-border/60 bg-card/30">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-500/10">
        <ShoppingBag className="h-7 w-7 text-orange-400" />
      </div>

      <div className="text-center space-y-1.5">
        <h3 className="text-base font-semibold">Chưa kết nối Shopee</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Kết nối tài khoản Shopee để đồng bộ đơn hàng và sản phẩm về hệ thống OMS.
        </p>
      </div>

      <Button
        onClick={onConnect}
        disabled={isLoading}
        className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ExternalLink className="h-4 w-4" />
        )}
        {isLoading ? 'Đang tạo link...' : 'Kết nối Shopee'}
      </Button>

      <p className="text-xs text-muted-foreground">
        Bạn sẽ được chuyển đến Shopee để ủy quyền. Quay lại sau khi hoàn tất.
      </p>
    </div>
  )
}
