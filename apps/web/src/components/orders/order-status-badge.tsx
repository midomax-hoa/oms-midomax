import { Badge } from '@workspace/ui'

export type OrderStatus =
  | 'cho_xac_nhan'
  | 'dang_xu_ly'
  | 'dang_giao'
  | 'hoan_thanh'
  | 'da_huy'

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  cho_xac_nhan: {
    label: 'Chờ xác nhận',
    className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/50 hover:bg-yellow-500/20',
  },
  dang_xu_ly: {
    label: 'Đang xử lý',
    className: 'bg-blue-500/10 text-blue-500 border-blue-500/50 hover:bg-blue-500/20',
  },
  dang_giao: {
    label: 'Đang giao',
    className: 'bg-orange-500/10 text-orange-500 border-orange-500/50 hover:bg-orange-500/20',
  },
  hoan_thanh: {
    label: 'Hoàn thành',
    className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/50 hover:bg-emerald-500/20',
  },
  da_huy: {
    label: 'Đã hủy',
    className: 'bg-red-500/10 text-red-500 border-red-500/50 hover:bg-red-500/20',
  },
}

interface OrderStatusBadgeProps {
  status: OrderStatus
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <Badge variant="outline" className={`text-xs font-medium ${config.className}`}>
      {config.label}
    </Badge>
  )
}
