// apps/web/src/components/lazada/lazada-products-tab.tsx
import { useState, useEffect, useCallback } from 'react'
import { Button, Card, CardContent } from '@workspace/ui'
import { RefreshCw, Loader2, Package } from 'lucide-react'
import { LazadaConnectBanner } from './lazada-connect-banner'

interface LazadaProduct {
  item_id: number;
  attributes: {
    name: string;
    description: string;
  };
  skus: Array<{
    SkuId: string;
    SellerSku: string;
    price: number;
    available: number;
    Images: string[];
  }>;
}

export function LazadaProductsTab() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<LazadaProduct[]>([])

  const checkConnection = useCallback(async () => {
    try {
      const res = await fetch('/api/lazada/shops')
      const data = await res.json()
      if (data.shops && data.shops.length > 0) {
        setIsConnected(true)
        fetchProducts()
      }
    } catch (err) {
      console.error('Failed to check Lazada connection:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    checkConnection()
  }, [checkConnection])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/lazada/products')
      const data = await res.json()
      setProducts(data.data || [])
    } catch (err) {
      console.error('Failed to fetch Lazada products:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSync = () => {
    fetchProducts()
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
          Đồng bộ sản phẩm từ Lazada
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
              {products.length === 0 ? (
                <>
                  <Package className="h-8 w-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">Chưa có dữ liệu sản phẩm. Nhấn nút Đồng bộ để lấy dữ liệu.</p>
                </>
              ) : (
                <div className="w-full">
                  <p className="text-center py-4 text-sm text-muted-foreground">Đã lấy {products.length} sản phẩm. Đang chờ xử lý...</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
