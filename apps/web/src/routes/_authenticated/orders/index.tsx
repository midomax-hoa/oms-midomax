// apps/web/src/routes/_authenticated/orders/index.tsx
import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Button, Card, CardContent, Input } from '@workspace/ui'
import { Search, ChevronLeft, ChevronRight, Download, ShoppingBag } from 'lucide-react'
import { OrderTable, type Order } from '@/components/orders/order-table'
import type { OrderStatus } from '@/components/orders/order-status-badge'
import { ShopeeOrdersTab } from '@/components/shopee/shopee-orders-tab'
import { LazadaOrdersTab } from '@/components/lazada/lazada-orders-tab'

export const Route = createFileRoute('/_authenticated/orders/')(({
  component: OrdersPage,
}))

const ITEMS_PER_PAGE = 25

const orders: Order[] = [
  { id: 'DH001', date: '2026-03-01', customer: 'Nguyễn Văn An', total: 2500000, status: 'cho_xac_nhan', payment: 'COD', shipping: 'Giao hàng nhanh' },
  { id: 'DH002', date: '2026-03-01', customer: 'Trần Thị Bích', total: 1850000, status: 'dang_xu_ly', payment: 'Chuyển khoản', shipping: 'Giao hàng tiết kiệm' },
  { id: 'DH003', date: '2026-03-02', customer: 'Lê Hoàng Cường', total: 4200000, status: 'dang_giao', payment: 'Ví điện tử', shipping: 'Viettel Post' },
  { id: 'DH004', date: '2026-03-02', customer: 'Phạm Minh Đức', total: 890000, status: 'hoan_thanh', payment: 'COD', shipping: 'Giao hàng nhanh' },
  { id: 'DH005', date: '2026-03-03', customer: 'Võ Thị Em', total: 3150000, status: 'da_huy', payment: 'Chuyển khoản', shipping: 'Giao hàng tiết kiệm' },
  { id: 'DH006', date: '2026-03-04', customer: 'Hoàng Văn Phúc', total: 6700000, status: 'cho_xac_nhan', payment: 'Ví điện tử', shipping: 'Giao hàng nhanh' },
  { id: 'DH007', date: '2026-03-05', customer: 'Đặng Thị Giang', total: 1200000, status: 'dang_xu_ly', payment: 'COD', shipping: 'Viettel Post' },
  { id: 'DH008', date: '2026-03-05', customer: 'Bùi Quốc Huy', total: 5400000, status: 'dang_giao', payment: 'Chuyển khoản', shipping: 'Giao hàng nhanh' },
  { id: 'DH009', date: '2026-03-06', customer: 'Ngô Thị Inh', total: 780000, status: 'hoan_thanh', payment: 'Ví điện tử', shipping: 'Giao hàng tiết kiệm' },
  { id: 'DH010', date: '2026-03-07', customer: 'Đỗ Văn Khánh', total: 9200000, status: 'dang_xu_ly', payment: 'Chuyển khoản', shipping: 'Viettel Post' },
  { id: 'DH011', date: '2026-03-08', customer: 'Lý Thị Lan', total: 1650000, status: 'cho_xac_nhan', payment: 'COD', shipping: 'Giao hàng nhanh' },
  { id: 'DH012', date: '2026-03-09', customer: 'Trương Văn Minh', total: 3800000, status: 'dang_giao', payment: 'Ví điện tử', shipping: 'Giao hàng tiết kiệm' },
  { id: 'DH013', date: '2026-03-10', customer: 'Nguyễn Thị Ngọc', total: 2100000, status: 'dang_xu_ly', payment: 'Chuyển khoản', shipping: 'Giao hàng nhanh' },
  { id: 'DH014', date: '2026-03-11', customer: 'Phan Văn Oanh', total: 4500000, status: 'hoan_thanh', payment: 'COD', shipping: 'Viettel Post' },
  { id: 'DH015', date: '2026-03-12', customer: 'Mai Thị Phương', total: 1950000, status: 'dang_giao', payment: 'Ví điện tử', shipping: 'Giao hàng tiết kiệm' },
  { id: 'DH016', date: '2026-03-13', customer: 'Vũ Quang Sơn', total: 7300000, status: 'cho_xac_nhan', payment: 'Chuyển khoản', shipping: 'Giao hàng nhanh' },
  { id: 'DH017', date: '2026-03-14', customer: 'Trịnh Văn Tài', total: 560000, status: 'da_huy', payment: 'COD', shipping: 'Viettel Post' },
  { id: 'DH018', date: '2026-03-15', customer: 'Cao Thị Uyên', total: 2800000, status: 'dang_xu_ly', payment: 'Ví điện tử', shipping: 'Giao hàng nhanh' },
  { id: 'DH019', date: '2026-03-16', customer: 'Lâm Văn Vinh', total: 4100000, status: 'dang_giao', payment: 'Chuyển khoản', shipping: 'Giao hàng tiết kiệm' },
  { id: 'DH020', date: '2026-03-17', customer: 'Đinh Thị Xuân', total: 1300000, status: 'hoan_thanh', payment: 'COD', shipping: 'Viettel Post' },
  { id: 'DH021', date: '2026-03-18', customer: 'Hà Văn Yên', total: 8500000, status: 'cho_xac_nhan', payment: 'Ví điện tử', shipping: 'Giao hàng nhanh' },
  { id: 'DH022', date: '2026-03-19', customer: 'Lương Thị Anh', total: 990000, status: 'dang_xu_ly', payment: 'Chuyển khoản', shipping: 'Giao hàng tiết kiệm' },
  { id: 'DH023', date: '2026-03-20', customer: 'Dương Văn Bình', total: 3600000, status: 'da_huy', payment: 'COD', shipping: 'Viettel Post' },
  { id: 'DH024', date: '2026-03-21', customer: 'Tạ Thị Cẩm', total: 5100000, status: 'dang_giao', payment: 'Ví điện tử', shipping: 'Giao hàng nhanh' },
  { id: 'DH025', date: '2026-03-22', customer: 'Quách Văn Đạt', total: 2250000, status: 'hoan_thanh', payment: 'Chuyển khoản', shipping: 'Giao hàng tiết kiệm' },
]

type TabKey = 'tat_ca' | OrderStatus | 'shopee' | 'lazada'

const tabs: { key: TabKey; label: string; isShopee?: boolean; isLazada?: boolean }[] = [
  { key: 'tat_ca', label: 'Tất cả' },
  { key: 'cho_xac_nhan', label: 'Chờ xác nhận' },
  { key: 'dang_xu_ly', label: 'Đang xử lý' },
  { key: 'dang_giao', label: 'Đang giao' },
  { key: 'hoan_thanh', label: 'Hoàn thành' },
  { key: 'da_huy', label: 'Đã hủy' },
  { key: 'shopee', label: 'Shopee', isShopee: true },
  { key: 'lazada', label: 'Lazada', isLazada: true },
]

function getCountByStatus(status: TabKey): number {
  if (status === 'tat_ca') return orders.length
  if (status === 'shopee' || status === 'lazada') return 0
  return orders.filter((o) => o.status === status).length
}

function OrdersPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('tat_ca')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = orders.filter((o) => {
    const matchesTab = activeTab === 'tat_ca' || activeTab === 'shopee' || activeTab === 'lazada' || o.status === activeTab
    const matchesSearch =
      !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase())
    return matchesTab && matchesSearch
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Đơn hàng</h1>
        <p className="text-sm text-muted-foreground mt-1">Quản lý và theo dõi đơn hàng</p>
      </div>

      <div className="flex gap-1 border-b border-border/50">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setPage(1) }}
            className={`flex items-center gap-1.5 px-4 py-2.5 cursor-pointer text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? tab.isShopee
                  ? 'border-b-2 border-orange-400 text-orange-400'
                  : tab.isLazada
                    ? 'border-b-2 border-blue-400 text-blue-400'
                    : 'border-b-2 border-primary text-primary'
                : tab.isShopee
                  ? 'border-b-2 border-transparent text-orange-400/60 hover:text-orange-400 ml-auto'
                  : tab.isLazada
                    ? 'border-b-2 border-transparent text-blue-400/60 hover:text-blue-400'
                    : 'border-b-2 border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {(tab.isShopee || tab.isLazada) && <ShoppingBag className={`h-3.5 w-3.5 ${tab.isLazada ? 'text-blue-400' : ''}`} />}
            {tab.label}
            {!tab.isShopee && !tab.isLazada && (
              <span className="text-xs text-muted-foreground">({getCountByStatus(tab.key)})</span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'shopee' ? (
        <ShopeeOrdersTab />
      ) : activeTab === 'lazada' ? (
        <LazadaOrdersTab />
      ) : (
        <>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo mã đơn, khách hàng..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="pl-9 bg-card/50 border-border/50"
              />
            </div>
            <Button variant="outline" className="cursor-pointer border-border/50">
              <Download className="h-4 w-4" />
              Xuất Excel
            </Button>
          </div>

          <Card className="border-border/50 bg-card/80 overflow-hidden">
            <CardContent className="p-0">
              <OrderTable orders={paginated} />
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Hiển thị {paginated.length} / {filtered.length} đơn hàng
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="border-border/50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground font-mono tabular-nums px-2">
                {currentPage}/{totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="border-border/50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
