// apps/web/src/routes/_authenticated/products/index.tsx
import { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Button, Input } from '@workspace/ui'
import { Search, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react'
import { ProductTable, type Product } from '@/components/products/product-table'
import type { ProductStatus } from '@/components/products/product-status-badge'
import { ShopeeProductsTab } from '@/components/shopee/shopee-products-tab'
import { LazadaProductsTab } from '@/components/lazada/lazada-products-tab'

export const Route = createFileRoute('/_authenticated/products/')({
  component: ProductsPage,
})

const PRODUCTS: Product[] = [
  { id: 'SP001', name: 'Tai nghe Bluetooth', sku: 'SKU-1001', category: 'Điện tử', price: 350000, stock: 45, status: 'in_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP002', name: 'Áo thun nam', sku: 'SKU-1002', category: 'Thời trang', price: 180000, stock: 120, status: 'in_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP003', name: 'Ốp lưng điện thoại', sku: 'SKU-1003', category: 'Phụ kiện', price: 95000, stock: 5, status: 'low_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP004', name: 'Chuột không dây', sku: 'SKU-1004', category: 'Điện tử', price: 250000, stock: 0, status: 'out_of_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP005', name: 'Quần jeans nữ', sku: 'SKU-1005', category: 'Thời trang', price: 420000, stock: 30, status: 'in_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP006', name: 'Sạc dự phòng 10000mAh', sku: 'SKU-1006', category: 'Điện tử', price: 290000, stock: 8, status: 'low_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP007', name: 'Kính mát thời trang', sku: 'SKU-1007', category: 'Phụ kiện', price: 150000, stock: 0, status: 'out_of_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP008', name: 'Áo khoác gió', sku: 'SKU-1008', category: 'Thời trang', price: 550000, stock: 22, status: 'in_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP009', name: 'Loa bluetooth mini', sku: 'SKU-1009', category: 'Điện tử', price: 480000, stock: 3, status: 'low_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP010', name: 'Dây nịt da', sku: 'SKU-1010', category: 'Phụ kiện', price: 120000, stock: 60, status: 'in_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP011', name: 'Bàn phím cơ', sku: 'SKU-1011', category: 'Điện tử', price: 890000, stock: 15, status: 'in_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP012', name: 'Váy liền nữ', sku: 'SKU-1012', category: 'Thời trang', price: 380000, stock: 0, status: 'out_of_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP013', name: 'Tai nghe chụp tai', sku: 'SKU-1013', category: 'Điện tử', price: 720000, stock: 7, status: 'low_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP014', name: 'Balo laptop', sku: 'SKU-1014', category: 'Phụ kiện', price: 450000, stock: 35, status: 'in_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP015', name: 'Áo sơ mi nam', sku: 'SKU-1015', category: 'Thời trang', price: 320000, stock: 50, status: 'in_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP016', name: 'USB flash 64GB', sku: 'SKU-1016', category: 'Điện tử', price: 160000, stock: 0, status: 'out_of_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP017', name: 'Ví da nam', sku: 'SKU-1017', category: 'Phụ kiện', price: 280000, stock: 4, status: 'low_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP018', name: 'Giày thể thao', sku: 'SKU-1018', category: 'Thời trang', price: 680000, stock: 18, status: 'in_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP019', name: 'Webcam HD 1080p', sku: 'SKU-1019', category: 'Điện tử', price: 520000, stock: 0, status: 'out_of_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP020', name: 'Đồng hồ đeo tay', sku: 'SKU-1020', category: 'Phụ kiện', price: 950000, stock: 10, status: 'in_stock', image: 'https://placehold.co/80x80' },
]

const PAGE_SIZE = 10

type TabKey = 'all' | ProductStatus | 'shopee' | 'lazada'

const TABS: { key: TabKey; label: string; filter?: (p: Product) => boolean; isShopee?: boolean; isLazada?: boolean }[] = [
  { key: 'all', label: 'Tất cả', filter: () => true },
  { key: 'in_stock', label: 'Còn hàng', filter: (p) => p.status === 'in_stock' },
  { key: 'low_stock', label: 'Sắp hết', filter: (p) => p.status === 'low_stock' },
  { key: 'out_of_stock', label: 'Hết hàng', filter: (p) => p.status === 'out_of_stock' },
  { key: 'shopee', label: 'Shopee', isShopee: true },
  { key: 'lazada', label: 'Lazada', isLazada: true },
]

function ProductsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (activeTab === 'shopee' || activeTab === 'lazada') return []
    const tab = TABS.find((t) => t.key === activeTab)!
    return PRODUCTS.filter(tab.filter!).filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()),
    )
  }, [activeTab, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0, in_stock: 0, low_stock: 0, out_of_stock: 0, shopee: 0, lazada: 0 }
    for (const p of PRODUCTS) {
      counts.all++
      counts[p.status]++
    }
    return counts
  }, [])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Sản phẩm</h1>
        <p className="text-sm text-muted-foreground mt-1">Quản lý danh mục sản phẩm</p>
      </div>

      <div className="flex gap-1 border-b border-border/50">
        {TABS.map((tab) => (
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
              <span className="ml-1 text-xs text-muted-foreground">({tabCounts[tab.key] ?? 0})</span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'shopee' ? (
        <ShopeeProductsTab />
      ) : activeTab === 'lazada' ? (
        <LazadaProductsTab />
      ) : (
        <>
          <div className="flex items-center gap-3">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên, mã SKU..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="pl-9 bg-card/50 border-border/50"
              />
            </div>
          </div>

          <ProductTable products={paginated} />

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Hiển thị {paginated.length} / {filtered.length} sản phẩm
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
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
                size="icon"
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
