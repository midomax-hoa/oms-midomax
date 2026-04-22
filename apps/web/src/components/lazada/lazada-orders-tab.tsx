// apps/web/src/components/lazada/lazada-orders-tab.tsx
import { useState, useEffect, useCallback } from 'react'
import { Button, Card, CardContent } from '@workspace/ui'
import { RefreshCw, Loader2, ShoppingBag } from 'lucide-react'
import { LazadaConnectBanner } from './lazada-connect-banner'

interface LazadaOrder {
  order_id: number;
  order_number: string;
  statuses: string[];
  created_at: string;
  price: string;
  // Add other fields as needed
}

export function LazadaOrdersTab() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState<LazadaOrder[]>([])

  const checkConnection = useCallback(async () => {
    try {
      const res = await fetch('/api/lazada/shops')
      const data = await res.json()
      if (data.shops && data.shops.length > 0) {
        setIsConnected(true)
        fetchOrders()
      }
    } catch (err) {
      console.error('Failed to check Lazada connection:', err)
    } finally {
      setIsLoading(false)
    }
  }, []) // fetchOrders is called inside but define it before or use it as a dependency

  useEffect(() => {
    checkConnection()
  }, [checkConnection])

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/lazada/orders')
      const data = await res.json()
      setOrders(data.data || [])
    } catch (err) {
      console.error('Failed to fetch Lazada orders:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSync = () => {
    fetchOrders()
  }

  if (isLoading && !isConnected) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!isConnected) {
    return (
      <LazadaConnectBanner
        isLoading={isLoading}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Đồng bộ đơn hàng từ Lazada
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSync}
          disabled={isLoading}
          className="border-border/50 gap-1.5"
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          Đồng bộ từ Lazada
        </Button>
      </div>

      <Card className="border-border/50 bg-card/80 overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              {orders.length === 0 ? (
                <>
                  <ShoppingBag className="h-8 w-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">Chưa có dữ liệu đơn hàng. Nhấn nút Đồng bộ để lấy dữ liệu.</p>
                </>
              ) : (
                <div className="w-full">
                  {/* Future: Order table implementation */}
                  <p className="text-center py-4 text-sm text-muted-foreground">Đã lấy {orders.length} đơn hàng. Đang chờ xử lý...</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
