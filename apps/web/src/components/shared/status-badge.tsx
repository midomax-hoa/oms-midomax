import { Badge } from '@workspace/ui'

type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'default'

interface StatusBadgeProps {
  status: string
  variant: StatusVariant
}

const variantStyles: Record<StatusVariant, string> = {
  success: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100',
  danger: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100',
  info: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100',
  default: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100',
}

export function StatusBadge({ status, variant }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={variantStyles[variant]}>
      {status}
    </Badge>
  )
}
