// apps/web/src/components/shopee/use-shopee-connect.ts
import { useState, useCallback } from 'react'
import { api } from '@/lib/api'

interface ConnectedShop {
  shopId: number
  isExpired: boolean
}

interface UseShopeeConnectReturn {
  connectedShops: ConnectedShop[]
  isConnecting: boolean
  isLoadingShops: boolean
  fetchConnectedShops: () => Promise<void>
  handleConnect: () => Promise<void>
}

export function useShopeeConnect(): UseShopeeConnectReturn {
  const [connectedShops, setConnectedShops] = useState<ConnectedShop[]>([])
  const [isConnecting, setIsConnecting] = useState(false)
  const [isLoadingShops, setIsLoadingShops] = useState(false)

  const fetchConnectedShops = useCallback(async () => {
    setIsLoadingShops(true)
    try {
      const data = await api.get<{ shops: ConnectedShop[] }>('/shopee/shops')
      setConnectedShops(data.shops || [])
    } catch {
      // API not reachable — treat as not connected
    } finally {
      setIsLoadingShops(false)
    }
  }, [])

  const handleConnect = useCallback(async () => {
    setIsConnecting(true)
    try {
      const data = await api.get<{ url: string }>('/shopee/auth-link')
      window.open(data.url, '_blank', 'noreferrer')
    } catch (err) {
      console.error('Shopee connect error:', err)
    } finally {
      setIsConnecting(false)
    }
  }, [])

  return {
    connectedShops,
    isConnecting,
    isLoadingShops,
    fetchConnectedShops,
    handleConnect,
  }
}
