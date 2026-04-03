import { Badge } from '@workspace/ui'

export type ProductStatus = 'in_stock' | 'low_stock' | 'out_of_stock'

const statusConfig: Record<ProductStatus, { label: string; className: string }> = {
  in_stock: {
    label: 'Còn hàng',
    className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/50 hover:bg-emerald-500/20',
  },
  low_stock: {
    label: 'Sắp hết',
    className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/50 hover:bg-yellow-500/20',
  },
  out_of_stock: {
    label: 'Hết hàng',
    className: 'bg-red-500/10 text-red-500 border-red-500/50 hover:bg-red-500/20',
  },
}

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  const config = statusConfig[status]
  return (
    <Badge variant="outline" className={`text-xs font-medium ${config.className}`}>
      {config.label}
    </Badge>
  )
}
