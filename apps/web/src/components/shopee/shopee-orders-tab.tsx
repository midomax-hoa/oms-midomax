// apps/web/src/components/shopee/shopee-orders-tab.tsx
import { useState, useEffect, useCallback } from 'react'
import { Button, Card, CardContent } from '@workspace/ui'
import { ChevronLeft, ChevronRight, RefreshCw, Loader2 } from 'lucide-react'
import { ShopeeConnectBanner } from './shopee-connect-banner'
import { useShopeeConnect } from './use-shopee-connect'
import { api } from '@/lib/api'

interface ShopeeOrderItem {
  item_name: string
  model_quantity_purchased: number
  model_discounted_price: number
}

interface ShopeeOrder {
  order_sn: string
  order_status: string
  create_time: number
  buyer_username: string
  total_amount: string
  currency: string
  payment_method: string
  item_list: ShopeeOrderItem[]
}

interface OrdersResponse {
  orders: ShopeeOrder[]
  more: boolean
  nextCursor: string
}

const STATUS_LABEL: Record<string, string> = {
  UNPAID: 'Chưa thanh toán',
  READY_TO_SHIP: 'Chờ giao hàng',
  PROCESSED: 'Đang xử lý',
  SHIPPED: 'Đang giao',
  TO_CONFIRM_RECEIVE: 'Chờ xác nhận',
  IN_CANCEL: 'Đang hủy',
  CANCELLED: 'Đã hủy',
  COMPLETED: 'Hoàn thành',
}

const STATUS_STYLE: Record<string, string> = {
  UNPAID: 'bg-yellow-500/10 text-yellow-400 border-yellow-400/20',
  READY_TO_SHIP: 'bg-blue-500/10 text-blue-400 border-blue-400/20',
  PROCESSED: 'bg-blue-500/10 text-blue-400 border-blue-400/20',
  SHIPPED: 'bg-indigo-500/10 text-indigo-400 border-indigo-400/20',
  TO_CONFIRM_RECEIVE: 'bg-orange-500/10 text-orange-400 border-orange-400/20',
  CANCELLED: 'bg-red-500/10 text-red-400 border-red-400/20',
  IN_CANCEL: 'bg-red-500/10 text-red-400 border-red-400/20',
  COMPLETED: 'bg-emerald-500/10 text-emerald-400 border-emerald-400/20',
}

export function ShopeeOrdersTab() {
  const { connectedShops, isConnecting, fetchConnectedShops, handleConnect } = useShopeeConnect()
  const [orders, setOrders] = useState<ShopeeOrder[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cursors, setCursors] = useState<string[]>([''])
  const [cursorIndex, setCursorIndex] = useState(0)

  const currentCursor = cursors[cursorIndex] ?? ''
  const hasConnectedShop = connectedShops.some((s) => !s.isExpired)

  const fetchOrders = useCallback(
    async (cursor: string) => {
      if (!hasConnectedShop) return
      setIsLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams({ page_size: '10' })
        if (cursor) params.set('cursor', cursor)
        const data = await api.get<OrdersResponse>(`/shopee/orders?${params}`)
        setOrders(data.orders)
        // Append next cursor to stack for forward navigation
        if (data.more && data.nextCursor) {
          setCursors((prev) => {
            const next = [...prev]
            if (next[cursorIndex + 1] !== data.nextCursor) {
              next[cursorIndex + 1] = data.nextCursor
            }
            return next
          })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi không xác định')
      } finally {
        setIsLoading(false)
      }
    },
    [hasConnectedShop, cursorIndex],
  )

  useEffect(() => {
    void fetchConnectedShops()
  }, [fetchConnectedShops])

  useEffect(() => {
    if (hasConnectedShop) {
      void fetchOrders(currentCursor)
    }
  }, [hasConnectedShop, fetchOrders, currentCursor])

  const handlePrev = () => setCursorIndex((i) => Math.max(0, i - 1))
  const handleNext = () => setCursorIndex((i) => i + 1)

  if (!hasConnectedShop) {
    return (
      <ShopeeConnectBanner
        connectedShops={connectedShops}
        onConnect={handleConnect}
        isLoading={isConnecting}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Dữ liệu đơn hàng từ Shopee · 30 ngày gần nhất
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void fetchOrders(currentCursor)}
          disabled={isLoading}
          className="border-border/50 gap-1.5"
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          Làm mới
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <Card className="border-border/50 bg-card/80 overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
              Không có đơn hàng nào trong 30 ngày qua
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground">
                    Mã đơn
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                    Người mua
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                    Sản phẩm
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                    Tổng tiền
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                    Ngày tạo
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {orders.map((order) => (
                  <tr
                    key={order.order_sn}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-3 font-mono text-xs text-primary font-medium whitespace-nowrap">
                      {order.order_sn}
                    </td>
                    <td className="px-4 py-3 text-sm">{order.buyer_username || '—'}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-[200px] truncate">
                      {order.item_list?.map((i) => i.item_name).join(', ') || '—'}
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums text-sm whitespace-nowrap">
                      {Number(order.total_amount).toLocaleString('vi-VN')} {order.currency}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(order.create_time * 1000).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${
                          STATUS_STYLE[order.order_status] ??
                          'bg-muted/50 text-muted-foreground border-border/30'
                        }`}
                      >
                        {STATUS_LABEL[order.order_status] ?? order.order_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Hiển thị {orders.length} đơn hàng
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={cursorIndex <= 0 || isLoading}
            onClick={handlePrev}
            className="border-border/50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground font-mono tabular-nums px-2">
            {cursorIndex + 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!cursors[cursorIndex + 1] || isLoading}
            onClick={handleNext}
            className="border-border/50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
