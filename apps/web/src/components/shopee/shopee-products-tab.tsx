// apps/web/src/components/shopee/shopee-products-tab.tsx
import { useState, useEffect, useCallback } from 'react'
import { Button, Card, CardContent } from '@workspace/ui'
import { ChevronLeft, ChevronRight, RefreshCw, Loader2, Package } from 'lucide-react'
import { ShopeeConnectBanner } from './shopee-connect-banner'
import { useShopeeConnect } from './use-shopee-connect'
import { api } from '@/lib/api'

const PAGE_SIZE = 10

interface ShopeePriceInfo {
  original_price: number
  current_price: number
}

interface ShopeeProduct {
  item_id: number
  item_name: string
  item_status: string
  price_info: ShopeePriceInfo[]
  image: { image_url_list: string[] }
  stock_info: Array<{ normal_stock: number }>
}

interface ProductsResponse {
  products: ShopeeProduct[]
  hasNextPage: boolean
  nextOffset: number
  totalCount: number
}

function getMainImage(product: ShopeeProduct): string | undefined {
  return product.image?.image_url_list?.[0]
}

function getPrice(product: ShopeeProduct): number {
  return product.price_info?.[0]?.current_price ?? 0
}

function getTotalStock(product: ShopeeProduct): number {
  return product.stock_info?.reduce((sum, s) => sum + (s.normal_stock ?? 0), 0) ?? 0
}

export function ShopeeProductsTab() {
  const { connectedShops, isConnecting, fetchConnectedShops, handleConnect } = useShopeeConnect()
  const [products, setProducts] = useState<ShopeeProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [offset, setOffset] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [hasNextPage, setHasNextPage] = useState(false)

  const hasConnectedShop = connectedShops.some((s) => !s.isExpired)

  const fetchProducts = useCallback(
    async (currentOffset: number) => {
      if (!hasConnectedShop) return
      setIsLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams({
          offset: String(currentOffset),
          page_size: String(PAGE_SIZE),
        })
        const data = await api.get<ProductsResponse>(`/shopee/products?${params}`)
        setProducts(data.products)
        setTotalCount(data.totalCount)
        setHasNextPage(data.hasNextPage)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi không xác định')
      } finally {
        setIsLoading(false)
      }
    },
    [hasConnectedShop],
  )

  useEffect(() => {
    void fetchConnectedShops()
  }, [fetchConnectedShops])

  useEffect(() => {
    if (hasConnectedShop) {
      void fetchProducts(offset)
    }
  }, [hasConnectedShop, fetchProducts, offset])

  const handlePrev = () => setOffset((o) => Math.max(0, o - PAGE_SIZE))
  const handleNext = () => setOffset((o) => o + PAGE_SIZE)

  if (!hasConnectedShop) {
    return (
      <ShopeeConnectBanner
        connectedShops={connectedShops}
        onConnect={handleConnect}
        isLoading={isConnecting}
      />
    )
  }

  const currentPage = Math.floor(offset / PAGE_SIZE) + 1
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Tổng {totalCount} sản phẩm từ Shopee
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void fetchProducts(offset)}
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
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Package className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">Không có sản phẩm nào</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground w-14">
                    Ảnh
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                    Tên sản phẩm
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                    ID
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                    Giá
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                    Tồn kho
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {products.map((product) => {
                  const imgUrl = getMainImage(product)
                  const price = getPrice(product)
                  const stock = getTotalStock(product)

                  return (
                    <tr
                      key={product.item_id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-3">
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={product.item_name}
                            className="w-10 h-10 rounded-md object-cover border border-border/30"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-muted/40 flex items-center justify-center">
                            <Package className="h-4 w-4 text-muted-foreground/40" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 max-w-[240px]">
                        <p className="font-medium truncate" title={product.item_name}>
                          {product.item_name}
                        </p>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {product.item_id}
                      </td>
                      <td className="px-4 py-3 font-mono tabular-nums text-sm whitespace-nowrap">
                        {price.toLocaleString('vi-VN')}₫
                      </td>
                      <td className="px-4 py-3 tabular-nums text-sm">
                        {stock.toLocaleString('vi-VN')}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${
                            product.item_status === 'NORMAL'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-400/20'
                              : 'bg-muted/50 text-muted-foreground border-border/30'
                          }`}
                        >
                          {product.item_status === 'NORMAL' ? 'Đang bán' : product.item_status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Hiển thị {products.length} / {totalCount} sản phẩm
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={offset <= 0 || isLoading}
            onClick={handlePrev}
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
            disabled={!hasNextPage || isLoading}
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
