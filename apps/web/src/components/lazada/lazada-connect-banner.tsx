// apps/web/src/components/lazada/lazada-connect-banner.tsx
import { Button } from '@workspace/ui'
import { ShoppingBag, ExternalLink, Loader2 } from 'lucide-react'

interface LazadaConnectBannerProps {
  isLoading?: boolean
}

export function LazadaConnectBanner({
  isLoading = false,
}: LazadaConnectBannerProps) {
  const handleConnect = async () => {
    try {
      const response = await fetch('/api/lazada/auth-link')
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Failed to get Lazada auth link:', error)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 py-12 px-6 rounded-xl border border-dashed border-border/60 bg-card/30">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10">
        <ShoppingBag className="h-7 w-7 text-blue-400" />
      </div>

      <div className="text-center space-y-1.5">
        <h3 className="text-base font-semibold">Chưa kết nối Lazada</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Kết nối tài khoản Lazada để đồng bộ đơn hàng và sản phẩm về hệ thống OMS.
        </p>
      </div>

      <Button
        onClick={handleConnect}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ExternalLink className="h-4 w-4" />
        )}
        {isLoading ? 'Đang tạo link...' : 'Kết nối Lazada'}
      </Button>

      <p className="text-xs text-muted-foreground">
        Bạn sẽ được chuyển đến Lazada để ủy quyền. Quay lại sau khi hoàn tất.
      </p>
    </div>
  )
}
